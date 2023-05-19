import { BaseCallbackHandler } from 'langchain/callbacks';
import {
  ChainValues,
  AgentAction,
  AgentFinish,
  LLMResult
} from 'langchain/schema';

class StreamingCallbackHandler extends BaseCallbackHandler {
  name = 'StreamingCallbackHandler';
  private static streamCallback?: (token: string) => void;

  static setStreamCallback(callback: (token: string) => void) {
    StreamingCallbackHandler.streamCallback = callback;
  }

  async handleChainEnd(_output: ChainValues) {
    if (
      StreamingCallbackHandler.streamCallback &&
      process.env.CHAIN_END_TRIGGER_MESSAGE
    ) {
      StreamingCallbackHandler.streamCallback(
        process.env.CHAIN_END_TRIGGER_MESSAGE
      );
    }
  }

  async handleLLMNewToken(token: string) {
    StreamingCallbackHandler.streamCallback &&
      StreamingCallbackHandler.streamCallback(token);
  }
}

export { StreamingCallbackHandler };
