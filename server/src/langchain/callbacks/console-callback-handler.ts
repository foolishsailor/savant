import { BaseCallbackHandler } from 'langchain/callbacks';
import chalk from 'chalk';
import {
  ChainValues,
  AgentAction,
  AgentFinish,
  LLMResult
} from 'langchain/schema';

class ConsoleCallbackHandler extends BaseCallbackHandler {
  name = 'ConsoleCallbackHandler';

  async handleChainStart(chain: { name: string }) {
    console.log(
      chalk.blue(
        `===== Entering new ${chalk.blue.bold(chain.name)} chain =====`
      )
    );
  }

  async handleChainEnd(output: ChainValues) {
    console.log(chalk.blue(`==== Finished chain ====`));
    console.log(JSON.stringify(output, null, 2));
  }

  async handleLLMStart(
    llm: {
      name: string;
    },
    prompts: string[],
    runId: string,
    parentRunId?: string | undefined
  ) {
    console.log(chalk.blue(`==== LLM end ====`));
    console.log(`${chalk.green.bold(`llm:`)} ${llm.name}`);
    console.log(`${chalk.green.bold(`prompts:`)} ${prompts}`);
    console.log(`${chalk.green.bold(`runId:`)} ${runId}`);
    console.log(`${chalk.green.bold(`parentRunId:`)} ${parentRunId}`);
  }

  async handleLLMEnd(output: LLMResult) {
    console.log(
      chalk.blue(`==== LLM end ====`),
      JSON.stringify(output, null, 2)
    );
  }

  async handleAgentAction(action: AgentAction) {
    console.log(chalk.blue(`==== Agent Action ====`));
    console.log(action);
    console.log(`${chalk.magenta('  Agent Action RAW:')} ${action}`);
    console.log(`${chalk.green.bold(`    Agent Tool:`)} ${action.tool}`);
    console.log(`${chalk.green.bold(`   Agent Input:`)} ${action.toolInput}`);
    console.log(`${chalk.green.bold(`     Agent Log:`)} ${action.log}`);
  }

  async handleToolEnd(output: string) {
    console.log(chalk.blue(`==== Tool End ====`));
    console.log(output);
  }

  async handleText(text: string) {
    console.log(chalk.blue(`==== Text ====`));
    console.log(text);
  }

  async handleAgentEnd(action: AgentFinish) {
    console.log(chalk.blue(`==== Agent Action End ====`));
    console.log(
      `${chalk.blue.bold(` Agent Return Values:`)} ${JSON.stringify(
        action.returnValues,
        null,
        2
      )}`
    );
  }
}

export { ConsoleCallbackHandler };
