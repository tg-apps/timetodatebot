const COMMAND_LIST = `\
/newyear - Новый год
/christmas - Рождество
/summer - Лето

/birthday - День рождения

/date - Любая дата

/help - Помощь
` as const;

const ESCAPED_COMMAND_LIST = COMMAND_LIST.replaceAll("-", "\\-");

const HELP_MESSAGE = `\
*Список команд*

${ESCAPED_COMMAND_LIST}
` as const;

export { HELP_MESSAGE };
