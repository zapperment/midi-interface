import { Output } from "midi";
import openMidiPort from "./openMidiPort";

export default (midiPortName, isVirtual = false) => {
  const output = new Output();
  openMidiPort(midiPortName, output, "output", isVirtual);
  return output;
};
