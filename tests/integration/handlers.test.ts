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

import {
  handle_newyear,
  handle_christmas,
  handle_summer,
  handle_start,
  handle_help,
} from "#handlers";

describe("handle_newyear", () => {
  let capturedReply: string | undefined;

  const mockContext = {
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

  it("should reply with countdown to new year", async () => {
    await handle_newyear(mockContext);
    expect(capturedReply).toContain("Нового года");
    expect(capturedReply).toContain("недель");
  });
});

describe("handle_christmas", () => {
  let capturedReply: string | undefined;

  const mockContext = {
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

  it("should reply with countdown to christmas", async () => {
    await handle_christmas(mockContext);
    expect(capturedReply).toContain("Рождества");
    expect(capturedReply).toContain("недель");
  });
});

describe("handle_summer", () => {
  let capturedReply: string | undefined;

  const mockContext = {
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

  it("should reply with countdown to summer", async () => {
    await handle_summer(mockContext);
    expect(capturedReply).toContain("лета");
    expect(capturedReply).toContain("недель");
    expect(capturedReply).toMatchSnapshot();
  });
});

describe("handle_start", () => {
  let capturedReply: string | undefined;

  const mockContext = {
    reply: mock(async (text: string) => {
      capturedReply = text;
    }),
  } as unknown as CommandContext<Context>;

  it("should reply with help message", async () => {
    await handle_start(mockContext);
    expect(capturedReply).toContain("/date");
    expect(capturedReply).toMatchSnapshot();
  });
});

describe("handle_help", () => {
  let capturedReply: string | undefined;

  const mockContext = {
    reply: mock(async (text: string) => {
      capturedReply = text;
    }),
  } as unknown as CommandContext<Context>;

  it("should reply with help message", async () => {
    await handle_help(mockContext);
    expect(capturedReply).toContain("/date");
    expect(capturedReply).toMatchSnapshot();
  });
});
