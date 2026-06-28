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
import type { User } from "grammy/types";

import { handle_birthday } from "#handlers/birthday";

describe("handle_birthday", () => {
  let capturedReply: string | undefined;

  const mockContext = {
    reply: mock(async (text: string) => {
      capturedReply = text;
    }),
    from: { id: 99 },
  } as unknown as CommandContext<Context> & { from: User };

  beforeEach(() => {
    setSystemTime(new Date("2026-04-15T00:00:00"));
    capturedReply = undefined;
  });

  afterEach(() => {
    setSystemTime();
  });

  it("should handle a non-existent user", async () => {
    mockContext.from.id = 99;
    mockContext.match = "";
    await handle_birthday(mockContext);
    expect(capturedReply).toMatchSnapshot();
  });

  it("should handle adding user's birthday and getting it", async () => {
    mockContext.from.id = 72;
    mockContext.match = "25 4";
    await handle_birthday(mockContext);
    expect(capturedReply).toMatchSnapshot();
    mockContext.match = "";
    await handle_birthday(mockContext);
    expect(capturedReply).toMatchSnapshot();

    setSystemTime(new Date("2026-04-17T13:25:42"));
    await handle_birthday(mockContext);
    expect(capturedReply).toMatchSnapshot();

    setSystemTime(new Date("2026-06-22T19:12:38"));
    await handle_birthday(mockContext);
    expect(capturedReply).toMatchSnapshot();
  });
});
