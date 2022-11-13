//modulos externos
const inquirer = require("inquirer")
const chalk = require("chalk");

//modulos internos
const fs = require("fs");

operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer ?',
        choices:[
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'],
    },
]).then((answer) => {
    const action = answer['action'];

    if(action === 'Criar Conta'){
        createAccount();
    }

})
.catch(err => console.log(err))
}

//creating account

function createAccount(){
    console.log(chalk.bgGreen.white("Parabéns por escolher o nosso banco!"));
    console.log(chalk.green("a seguir, defina as opções da sua conta"))

    buildAccount();
}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta : ',

        },
    ]).then((answer) => {
        const accountName = answer['accountName'];
        console.info(accountName);

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.white('Esta conta já existe, escolha outro nome!'),
            )
            buildAccount();
            return
            
        }
        
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}',
        function(err){
            console.log(err)
        },
        )
        console.log(chalk.bgGreen.white('Parabéns, a sua conta foi criada!'))
        operation();
    }).catch(err => console.log(err));
}