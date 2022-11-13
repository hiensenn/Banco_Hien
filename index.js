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
])
.then((answer) => {
    const action = answer['action'];

    if(action === 'Criar Conta'){
        createAccount();
    }else if(action === 'Depositar'){
        deposit();
    }else if(action === 'Consultar Saldo'){
        getAccountBalance();
    }else if(action === 'Sacar'){
        withDraw();
    }else if(action === 'Sair'){
        console.log(chalk.bgBlue.black('Obrigado por usar nosso banco digital!'))
        process.exit()
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
    ])
    .then((answer) => {
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
    })
    .catch(err => console.log(err));
}

//add an amount to user account

function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta ?'
        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        //verify if accounts exists

        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount', 
                message: 'quanto você deseja depositar ? ',
            },
        ])
        .then((answer) => {
            const amount = answer['amount']

            //add a amount
            addAmount(accountName, amount);
            operation()
        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Essa conta não existe!'))
        console.log(chalk.bgRed.black('Tente novamente!'))

        return false
    }
    return true
}

function addAmount(accountName, amount){

    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'))

        return deposit();
    }

    // console.log(account)

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )
        console.log(chalk.green(`foi depositado o valor de R$${amount} na sua conta!`),)
    }     

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta ?', 
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)
        console.log(chalk.bgGreen.black`Olá , seu saldo é de R$${accountData.balance}`)

        operation()
    })
    .catch(err => console.log(err))
}

//withdraw  an amount from  user account

function withDraw(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta ? '
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withDraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor você de seja sacar ?'
            }
        ])
        .then((answer) => {
            const amount = answer['amount']

            // console.log(amount)
            removeAmount(accountName, amount)
            
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function removeAmount(accountName, amount){

    const  accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),)
        return withDraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponível'))
        return withDraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountName}.json`, 
    JSON.stringify(accountData),
    function(err){
        console.log(err)
    },
)
    console.log(chalk.bgGreen.black(`Foi realizado um saque de R$${amount} da sua conta`))
    operation()
}