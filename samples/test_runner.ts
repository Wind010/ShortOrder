import * as fs from 'fs';
import * as minimist from 'minimist';
import * as path from 'path';

import {
    AnyToken,
    setup,
    TestSuite,
    TokenizerFunction
} from '../src';

function go() {
    const args = minimist(process.argv.slice(2));

    const defaultTestFile = './data/restaurant-en/test_suite.yaml';
    const testFile = path.resolve(__dirname, args['f'] || defaultTestFile);

    const showAll = (args['a'] === true);
    const suiteFilter = (args['s']);

    if (suiteFilter) {
        console.log(`Running tests in suite: ${suiteFilter}`);
    }
    else {
        console.log('Running all tests.');
    }

    const world = setup(
        path.join(__dirname, './data/restaurant-en/menu.yaml'),
        path.join(__dirname, './data/restaurant-en/intents.yaml'),
        path.join(__dirname, './data/restaurant-en/attributes.yaml'),
        path.join(__dirname, './data/restaurant-en/quantifiers.yaml'),
        path.join(__dirname, './data/restaurant-en/units.yaml'),
        false
    );

    // Set up tokenizer
    const tokenizer: TokenizerFunction = (utterance: string): IterableIterator<AnyToken> =>
        (world.unified.processOneQuery(utterance) as AnyToken[]).values();

    const suite = TestSuite.fromYamlString(fs.readFileSync(testFile, 'utf8'));
    suite.run(world, showAll, suiteFilter, tokenizer);
}

go();
