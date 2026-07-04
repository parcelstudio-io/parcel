import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/ThemeProvider";
import { FloatingTabBar } from "@/components/FloatingTabBar";
import { getFloatingTabBarStyle } from "@/lib/tabBar";
import { fonts } from "@/lib/typography";

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: getFloatingTabBarStyle(isDark),
        headerStyle: {
          backgroundColor: colors.headerBg,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: fonts.semiBold,
          fontSize: 15,
          letterSpacing: 0.5,
          color: colors.text,
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Agent",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipse-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
