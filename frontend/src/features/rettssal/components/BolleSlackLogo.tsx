// Egen, Slack-inspirert logo for Bolle-retten (ikke Slacks ekte logo):
// fire avrundede streker i Slack-fargene som danner en #, med en kanelbolle i midten.
import { Group, Text } from "@mantine/core";
import { Kanelbolle } from "./Kanelbolle";

export function BolleSlackLogo() {
  return (
    <Group gap={8} wrap="nowrap" className="bolle-slack-logo">
      <svg width={44} height={44} viewBox="0 0 100 100" role="img" aria-label="Bolle-retten logo">
        <rect x="30" y="8" width="14" height="84" rx="7" fill="#36c5f0" />
        <rect x="56" y="8" width="14" height="84" rx="7" fill="#2eb67d" transform="rotate(0)" />
        <rect x="8" y="30" width="84" height="14" rx="7" fill="#ecb22e" opacity="0.95" />
        <rect x="8" y="56" width="84" height="14" rx="7" fill="#e01e5a" opacity="0.95" />
      </svg>
      <div style={{ position: "relative", marginLeft: -36, marginRight: 8 }}>
        <Kanelbolle size={26} />
      </div>
      <Text fw={900} c="white" size="lg"># bolle-retten</Text>
    </Group>
  );
}
