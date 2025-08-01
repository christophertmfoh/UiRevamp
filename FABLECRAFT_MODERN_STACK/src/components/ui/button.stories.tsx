import { Story } from '@ladle/react'
import { Button } from './button'

// Default export defines story metadata
export default {
  title: 'UI Components/Button',
}

// Each named export is a story
export const Default: Story = () => <Button>Click me</Button>

export const Variants: Story = () => (
  <div className="flex flex-col gap-4 p-4">
    <Button variant="default">Default Button</Button>
    <Button variant="destructive">Destructive Button</Button>
    <Button variant="outline">Outline Button</Button>
    <Button variant="secondary">Secondary Button</Button>
    <Button variant="ghost">Ghost Button</Button>
    <Button variant="link">Link Button</Button>
  </div>
)

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4 p-4">
    <Button size="sm">Small Button</Button>
    <Button size="default">Default Button</Button>
    <Button size="lg">Large Button</Button>
    <Button size="icon">🚀</Button>
  </div>
)

export const States: Story = () => (
  <div className="flex flex-col gap-4 p-4">
    <Button>Normal Button</Button>
    <Button disabled>Disabled Button</Button>
    <Button className="loading">Loading Button</Button>
  </div>
)

// Interactive playground with controls
export const Playground: Story = () => {
  return <Button>Interactive Button - Use Ladle controls to modify</Button>
}

// Real-world example
export const WithIcon: Story = () => (
  <div className="flex gap-4 p-4">
    <Button>
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add Item
    </Button>
    <Button variant="outline">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Upload
    </Button>
  </div>
)