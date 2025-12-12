import type { LucideIcon } from 'lucide-react-native'
import { cssInterop } from 'nativewind'

/**
 * Enables className prop support for Lucide icons in React Native
 * @param icon - Lucide icon component to enhance
 */
export function iconWithClassName(icon: LucideIcon): void {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  })
}
