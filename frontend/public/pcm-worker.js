class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sampleRate = 16000;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputData = input[0]; // Mono channel
      
      // Convert Float32 to Int16 PCM (little-endian)
      const buffer = new ArrayBuffer(inputData.length * 2);
      const view = new DataView(buffer);
      
      for (let i = 0; i < inputData.length; i++) {
        let val = Math.max(-1, Math.min(1, inputData[i]));
        val = val < 0 ? val * 0x8000 : val * 0x7FFF;
        view.setInt16(i * 2, val, true);
      }
      
      this.port.postMessage(buffer, [buffer]);
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
