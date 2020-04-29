const assert = require("assert");
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = "Irlan@32123123"
const HASH = "$2b$04$i.4zMB/fydWhAjfanWzbJOXg3t.qcdYGHJ8xV1RkrFNmHAEMssike"

describe("Testando metodos relacionados a senha", function () {

    it("Deve gerar um hash a partir de uma senha", async () => {
        const result = await PasswordHelper.hash(SENHA)
        assert.ok(result.length > 10)
    })

    it("Deve validar o hash comparado a senha", async () => {
        const result = await PasswordHelper.compare(SENHA, HASH)
        assert.ok(result)
    })
})