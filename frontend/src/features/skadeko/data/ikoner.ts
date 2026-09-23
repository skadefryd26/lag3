import {
  IconBike,
  IconCar,
  IconCat,
  IconDeviceMobile,
  IconDroplet,
  IconFileAlert,
  IconFlame,
  IconGuitarPick,
  IconHome,
  IconKeyboard,
  IconLuggage,
  IconSnowflake,
  IconSofa,
  IconTent,
  IconTree,
  IconWallet,
  type Icon,
} from '@tabler/icons-react';

/** Profesjonelle ikoner i stedet for emoji. Nøkkelen er sakens emoji i datafila. */
const IKONER: Record<string, Icon> = {
  '🧳': IconLuggage,
  '📱': IconDeviceMobile,
  '🚲': IconBike,
  '🍝': IconKeyboard,
  '🧊': IconSnowflake,
  '💧': IconDroplet,
  '🚗': IconCar,
  '🌳': IconTree,
  '🎸': IconGuitarPick,
  '🐈': IconCat,
  '🔥': IconFlame,
  '🏠': IconHome,
  '⛺': IconTent,
  '🦆': IconWallet,
  '🛋️': IconSofa,
};

export function sakensIkon(emoji: string): Icon {
  return IKONER[emoji] ?? IconFileAlert;
}
