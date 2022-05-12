import { Input } from "midi";
import openMidiPort from "./openMidiPort";

export default (midiPortName, isVirtual = false) => {
  const input = new Input();
  openMidiPort(midiPortName, input, "input", isVirtual);
  return input;
};
