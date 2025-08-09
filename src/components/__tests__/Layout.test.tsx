/* eslint-env jest */
import React from 'react'
import { render, screen as rtlScreen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../Layout'

// 包装组件以提供路由上下文
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout Component', () => {
  it('renders navigation', () => {
    renderWithRouter(<Layout />)
    expect(rtlScreen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders main content area', () => {
    renderWithRouter(<Layout />)
    expect(rtlScreen.getByRole('main')).toBeInTheDocument()
  })

  it('renders footer', () => {
    renderWithRouter(<Layout />)
    expect(rtlScreen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
