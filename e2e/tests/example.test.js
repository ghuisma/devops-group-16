import { Selector } from 'testcafe';

fixture('Website')
  .page('https://www.onequestionsurvey.nl/');

test('Check title', async t => {
  await t.expect(Selector('title').innerText).eql('Create Next App');
});
