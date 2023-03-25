import { Selector } from "testcafe";

fixture("Website").page("https://www.onequestionsurvey.nl/");

test("Check title", async (t) => {
  await t.expect(Selector("title").innerText).eql("One Question Survey App");
});

test("Login and create survey", async (t) => {
  const username = Selector('input[name="username"]');
  const password = Selector('input[name="password"]');
  const loginButton = Selector("button").withText("LOGIN");

  await t
    .typeText(username, process.env.TEST_QUESTION_USERNAME)
    .typeText(password, process.env.TEST_QUESTION_PASS)
    .click(loginButton)
    .expect(Selector("body").textContent)
    .contains("Dashboard", { timeout: 10000 });
});

fixture("ExampleSurvey").page(
  process.env.TEST_QUESTION_LINK
);

test("Answer question", async (t) => {
  const answerField = Selector('textarea[name="answer"]');

  await t
    .expect(Selector("body").textContent)
    .contains("Is this a test?", { timeout: 30000 })
    .typeText(answerField, "Yes")
    .click(Selector("button").withText("SUBMIT"))
    .expect(Selector("body").textContent, { timeout: 30000 })
    .contains("Response has been saved!");
});
