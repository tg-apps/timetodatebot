import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  setSystemTime,
  mock,
} from "bun:test";

import type { CommandContext, Context } from "grammy";

import { handle_date } from "#handlers/date";

describe("handle_date", () => {
  let capturedReply: string | undefined;

  const mockContext = {
    match: "",
    reply: mock(async (text: string) => {
      capturedReply = text;
    }),
  } as unknown as CommandContext<Context>;

  beforeEach(() => {
    setSystemTime(new Date("2026-04-15T00:00:00"));
    capturedReply = undefined;
  });

  afterEach(() => {
    setSystemTime();
  });

  it("should reply with formatted response for valid date", async () => {
    mockContext.match = "31 12";
    await handle_date(mockContext);
    expect(capturedReply).toContain("31.12");
    expect(capturedReply).toMatchSnapshot();
  });

  it("should reply with formatted response for date with year", async () => {
    mockContext.match = "31 12 2025";
    await handle_date(mockContext);
    expect(capturedReply).toContain("31.12.2025");
    expect(capturedReply).toMatchSnapshot();
  });

  it("should reply with usage message for invalid input", async () => {
    mockContext.match = "abc";
    await handle_date(mockContext);
    expect(capturedReply).toContain("Пример использования");
    expect(capturedReply).toMatchSnapshot();
  });

  it("should reply with usage message for empty input", async () => {
    mockContext.match = "";
    await handle_date(mockContext);
    expect(capturedReply).toContain("Пример использования");
    expect(capturedReply).toMatchSnapshot();
  });

  it("should reply with usage message for single number", async () => {
    mockContext.match = "31";
    await handle_date(mockContext);
    expect(capturedReply).toContain("Пример использования");
    expect(capturedReply).toMatchSnapshot();
  });
});
