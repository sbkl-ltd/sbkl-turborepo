import { SafeScrollView } from "@/components/ui/safe-scroll-view";
import { Text } from "@/components/ui/text";
import React from "react";

export default function ExploreScreen() {
  return (
    <SafeScrollView contentInsetAdjustmentBehavior="automatic">
      <Text>Explore content</Text>
    </SafeScrollView>
  );
}
