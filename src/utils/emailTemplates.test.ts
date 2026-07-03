import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import ejs from "ejs";

const renderTemplate = (templateName: string, data: Record<string, unknown>) => {
  return ejs.renderFile(path.resolve(process.cwd(), "src", "templates", `${templateName}.ejs`), data);
};

const loginUrl = "https://nexora.example.com/auth/signin";

test("teacher welcome email renders for created and promoted teacher accounts", async () => {
  const created = await renderTemplate("teacherWelcome", {
    name: "Ada",
    roleName: "Teacher",
    email: "ada@example.com",
    password: "TempPass123!",
    loginUrl,
  });
  assert.match(created, /Teacher Account/);
  assert.match(created, /TempPass123!/);
  assert.match(created, /auth\/signin/);

  const promoted = await renderTemplate("teacherWelcome", {
    name: "Grace",
    roleName: "Teacher",
    email: "grace@example.com",
    loginUrl,
  });
  assert.match(promoted, /upgraded to Teacher/);
  assert.doesNotMatch(promoted, /Temporary Password/);
});

test("teacher welcome email renders role-aware admin copy", async () => {
  const html = await renderTemplate("teacherWelcome", {
    name: "Linus",
    roleName: "Admin",
    email: "linus@example.com",
    loginUrl,
  });

  assert.match(html, /Admin Account/);
  assert.match(html, /upgraded to Admin/);
  assert.match(html, /manage users, approvals, content, and platform operations/);
  assert.doesNotMatch(html, /Teacher Account/);
});

test("cluster welcome email renders both new-member credentials and existing-member copy", async () => {
  const newMember = await renderTemplate("clusterWelcomeBack", {
    name: "Katherine",
    email: "katherine@example.com",
    password: "Generated123!",
    clusterName: "Physics 101",
    loginUrl,
  });
  assert.match(newMember, /Generated123!/);
  assert.match(newMember, /Temporary Password/);

  const existingMember = await renderTemplate("clusterWelcomeBack", {
    name: "Mary",
    email: "mary@example.com",
    clusterName: "Physics 101",
    loginUrl,
  });
  assert.match(existingMember, /existing credentials/);
  assert.doesNotMatch(existingMember, /Temporary Password/);
});
