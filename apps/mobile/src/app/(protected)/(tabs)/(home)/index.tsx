import * as React from "react";

import { SafeScrollView } from "@/components/ui/safe-scroll-view";
import { Text } from "@/components/ui/text-alt";
import { Button } from "@/components/ui/button";
import { Button as ButtonAlt } from "@/components/ui/button-alt";

export default function HomeScreen() {
  return (
    <SafeScrollView contentClassName="px-6 gap-4">
      <Text>Home content</Text>
      <Button>Click me</Button>
      <ButtonAlt variant="outline">
        <Text>Click me</Text>
      </ButtonAlt>
    </SafeScrollView>
  );
}
