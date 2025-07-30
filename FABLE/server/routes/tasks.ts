import { Router } from 'express';
import { db } from '../db';
import { tasks, writingGoals } from '@shared/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { authenticateToken } from '../auth';
import { z } from 'zod';

const router = Router();

// Task validation schema
const createTaskSchema = z.object({
  text: z.string().min(1),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  estimatedTime: z.number().optional(),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
});

const updateTaskSchema = createTaskSchema.partial();

// Get all tasks for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
    
    res.json(userTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get today's tasks
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.createdAt, today),
          lte(tasks.createdAt, tomorrow)
        )
      )
      .orderBy(desc(tasks.priority));
    
    res.json(todayTasks);
  } catch (error) {
    console.error('Error fetching today tasks:', error);
    res.status(500).json({ error: 'Failed to fetch today tasks' });
  }
});

// Create new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const validatedData = createTaskSchema.parse(req.body);
    
    const [newTask] = await db
      .insert(tasks)
      .values({
        ...validatedData,
        userId,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      })
      .returning();
    
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const validatedData = updateTaskSchema.parse(req.body);
    
    // If task is being marked as completed, set completedAt
    const updateData: any = { ...validatedData };
    if (validatedData.status === 'completed') {
      updateData.completedAt = new Date();
    }
    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate);
    }
    
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const [deletedTask] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get writing goals
router.get('/goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [goals] = await db
      .select()
      .from(writingGoals)
      .where(eq(writingGoals.userId, userId));
    
    // If no goals exist, return default values
    if (!goals) {
      return res.json({
        dailyWords: 500,
        dailyMinutes: 60,
        streakDays: 30,
      });
    }
    
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Update writing goals
router.post('/goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dailyWords, dailyMinutes, streakDays } = req.body;
    
    // Check if user already has goals
    const [existingGoals] = await db
      .select()
      .from(writingGoals)
      .where(eq(writingGoals.userId, userId));
    
    let updatedGoals;
    if (existingGoals) {
      // Update existing goals
      [updatedGoals] = await db
        .update(writingGoals)
        .set({
          dailyWords,
          dailyMinutes,
          streakDays,
          updatedAt: new Date(),
        })
        .where(eq(writingGoals.userId, userId))
        .returning();
    } else {
      // Create new goals
      [updatedGoals] = await db
        .insert(writingGoals)
        .values({
          userId,
          dailyWords,
          dailyMinutes,
          streakDays,
        })
        .returning();
    }
    
    res.json(updatedGoals);
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({ error: 'Failed to update goals' });
  }
});

// Get task statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Get all tasks from the past week
    const weekTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.createdAt, weekAgo)
        )
      );
    
    // Calculate statistics
    const totalTasks = weekTasks.length;
    const completedTasks = weekTasks.filter(t => t.status === 'completed').length;
    const pendingTasks = weekTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = weekTasks.filter(t => t.status === 'in-progress').length;
    
    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
});

export default router;