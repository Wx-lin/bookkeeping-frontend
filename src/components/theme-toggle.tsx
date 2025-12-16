import { Moon, Sun } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import { Button } from '~/components/ui/button'
import { iconWithClassName } from '~/lib/icons/icon-with-classname'

iconWithClassName(Moon)
iconWithClassName(Sun)

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onPress={toggleColorScheme}
      className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent shadow-lg"
      accessibilityLabel="切换主题"
    >
      {colorScheme === 'dark' ? (
        <Sun className="h-5 w-5 text-foreground transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-foreground transition-all" />
      )}
    </Button>
  )
}
