import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Apps Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'));
const Finance = lazy(() => import('@/app/(admin)/dashboard/finance/page'));
const Sales = lazy(() => import('@/app/(admin)/dashboard/sales/page'));

const Users = lazy(() => import('@/app/(admin)/apps/users/page'));
const Roles = lazy(() => import('@/app/(admin)/apps/roles/page'));
const Posts = lazy(() => import('@/app/(admin)/apps/posts/page'));
const CreatePost = lazy(() => import('@/app/(admin)/apps/posts/create/page'));
const CategoriesPage = lazy(() => import('@/app/(admin)/apps/categories/page'));

// Auth Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'));
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'));
const initialRoutes = [{
  path: '/',
  name: 'root',
  element: <Navigate to="/dashboard/analytics" />
}];
const generalRoutes = [{
  path: '/dashboard/analytics',
  name: 'Analytics',
  element: <Analytics />
}, {
  path: '/dashboard/finance',
  name: 'Finance',
  element: <Finance />
}, {
  path: '/dashboard/sales',
  name: 'Sales',
  element: <Sales />
}];
const appsRoutes = [{
  name: 'Users',
  path: '/users',
  element: <Users />

}, {
  name: 'Roles',
  path: '/roles',
  element: <Roles />
}, {
  name: 'Posts',
  path: '/posts',
  element: <Posts />
}, {
  name: 'CreatePost',
  path: '/posts/create',
  element: <CreatePost />
}, {
  name: 'UpdatePost',
  path: '/posts/update/:postId',
  element: <CreatePost />
}, {
  name: 'Categories',
  path: '/categories',
  element: <CategoriesPage />
}];
export const authRoutes = [{
  path: '/auth/sign-in',
  name: 'Sign In',
  element: <AuthSignIn />
}, {
  name: 'Sign Up',
  path: '/auth/sign-up',
  element: <AuthSignUp />
}];
export const appRoutes = [...initialRoutes, ...generalRoutes, ...appsRoutes, ...authRoutes];