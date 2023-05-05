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

  async handleChainStart(chain: { name: string }) {
    console.log(
      `====================================== Entering new ${chain.name} chain...`
    );
  }

  async handleChainEnd(_output: ChainValues) {
    console.log(
      '====================================== Finished chain.',
      _output
    );

    if (
      StreamingCallbackHandler.streamCallback &&
      process.env.CHAIN_END_TRIGGER_MESSAGE
    ) {
      StreamingCallbackHandler.streamCallback(
        process.env.CHAIN_END_TRIGGER_MESSAGE
      );
    }
  }

  async handleAgentAction(action: AgentAction) {
    console.log('======================================= action', action.log);
  }

  async handleToolEnd(output: string) {
    console.log('===================================== Tool End', output);
  }

  async handleText(text: string) {
    console.log('====================================== handleText', text);
  }

  async handleAgentEnd(action: AgentFinish) {
    console.log(
      '===================================== Agent action end',
      action.log
    );
  }

  async handleLLMEnd(output: LLMResult) {
    console.log(
      '===================================== LLM end',
      JSON.stringify(output)
    );
  }

  async handleLLMNewToken(token: string) {
    //console.log('token', token);
    StreamingCallbackHandler.streamCallback &&
      StreamingCallbackHandler.streamCallback(token);
  }
}

export { StreamingCallbackHandler };
