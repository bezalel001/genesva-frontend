import { AppShell, Container, Title, Group, Text } from '@mantine/core';
import { IconDna2 } from '@tabler/icons-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell
      padding="md"
      header={
        <Container fluid h="100%" px="md">
          <Group h="100%" align="center">
            <IconDna2 size={30} stroke={2} />
            <div>
              <Title order={3}>Gene Table Viewer</Title>
              <Text size="xs" c="dimmed">
                datavisyn Coding Challenge
              </Text>
            </div>
          </Group>
        </Container>
      }
    >
      {children}
    </AppShell>
  );
}
