'use client'

import Link from 'next/link'
import { useTransitionRouter } from 'next-view-transitions'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import type { RouteName, RouteSpecificProps } from '@/lib/routes'

//  This type creates a **discriminated union** of all possible prop combinations.
//
//  1. It maps over every possible `RouteKey`.
//  2. For each key, it resolves the specific required props using `RouteSpecificProps`.
//  3. It then joins them into a single union (`PropsForHome | PropsForProducts | ...`).
//  4. Finally, it intersects this union with shared props like `transition`
//  that are available on all link variants.
// 
//  @see RouteSpecificProps
//  @see RouteKey

export type Props = {
  [T in RouteName]: RouteSpecificProps<T>
}[RouteName] & Omit<ComponentProps<typeof Link>, 'href'> & {
  transition?: () => void
  children?: ReactNode
}

const LinkWithTransition = ({ route, routeArgs, transition, children }: Props) => {
  const router = useTransitionRouter()

  // To prevent a type error, as TS can't infer the specific link between `route` and `routeArgs` from the discriminated union.
  // Type assertion is safe here because the props' discriminated union guarantees a match.
  const href = (route.path as (args?: object) => string)(routeArgs);

  const clickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
    if (transition) {
      e.preventDefault()
      router.push(href, { onTransitionReady: transition })
    }
  };

  return (
    <Link href={href} onClick={clickHandler}>
      {children}
    </Link>
  );
};

export default LinkWithTransition;
