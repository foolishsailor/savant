import { BaseCallbackHandler } from 'langchain/callbacks';
import {
  ChainValues,
  AgentAction,
  AgentFinish,
  LLMResult
} from 'langchain/schema';

class StreamingCallbackHandler extends BaseCallbackHandler {
  name = 'StreamingCallbackHandler';
  private static callback?: (token: string) => void;

  static setCallback(callback: (token: string) => void) {
    StreamingCallbackHandler.callback = callback;
  }

  async handleChainStart(chain: { name: string }) {
    console.log(`===== Entering new ${chain.name} chain...`);
  }

  async handleChainEnd(_output: ChainValues) {
    console.log('===== Finished chain.', _output);
  }

  async handleAgentAction(action: AgentAction) {
    console.log('===== action', action.log);
  }

  async handleToolEnd(output: string) {
    console.log('===== Tool End', output);
  }

  async handleText(text: string) {
    console.log('handleText', text);
  }

  async handleAgentEnd(action: AgentFinish) {
    console.log('Agent action end', action.log);
  }

  async handleLLMEnd(output: LLMResult) {
    console.log('LLM end', JSON.stringify(output));
  }

  async handleLLMNewToken(token: string) {
    console.log('token', token);
    StreamingCallbackHandler.callback &&
      StreamingCallbackHandler.callback(token);
  }
}

export { StreamingCallbackHandler };
