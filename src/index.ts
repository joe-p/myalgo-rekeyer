import algosdk from 'algosdk'
import { MyAlgoSession } from './wallets/myalgo'

const myAlgo = new MyAlgoSession()
const algodClient = new algosdk.Algodv2("",'https://node.algoexplorerapi.io', '');

async function connect() {
    const accountsTable = document.getElementById('accounts') as HTMLTableElement
    const sender = document.getElementById('sender') as HTMLSelectElement
    const receiver = document.getElementById('receiver') as HTMLSelectElement

    await myAlgo.getAccounts()
    myAlgo.accounts.forEach(async acct => {
        let authAddr = (await algodClient.accountInformation(acct.address).do())['auth-addr'] || acct.address

        authAddr = myAlgo.accounts.find(a => a.address == authAddr)?.name || authAddr

        const row = accountsTable.insertRow()
        row.insertCell().innerHTML = acct.name
        row.insertCell().innerHTML = `<div class='address'>${authAddr}</div>`
        row.insertCell().innerHTML = `<div class='address'>${acct.address}</div>`
        row.insertCell().innerHTML = `<input type="radio" name="rekey-account" value=${acct.address} id=rekey-${acct.address}>`
        row.insertCell().innerHTML = `<input type="radio" name="rekey-to-account" value=${acct.address} id=rekey-to-${acct.address}>`


        sender.add(new Option(acct.name, acct.address))
        receiver.add(new Option(acct.name, acct.address))
        
    })
}

async function rekey() {
    const rekeyAccount = (document.querySelector('input[name="rekey-account"]:checked') as HTMLInputElement).value
    const rekeyToAccount = (document.querySelector('input[name="rekey-to-account"]:checked') as HTMLInputElement).value

    const suggestedParams = await algodClient.getTransactionParams().do()

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams,
        from: rekeyAccount,
        to: rekeyToAccount,
        amount: 0,
        rekeyTo: rekeyToAccount
    })

    console.log(`rekeying ${rekeyAccount} to ${rekeyToAccount}`)

    const signedTxns = (await myAlgo.signTxns([txn])).map(t => t.blob)
    console.log(await sendTxns(signedTxns))
}

async function sendTxns (txns: Array<Uint8Array>) {
    const txIDs = txns.map(t => algosdk.decodeSignedTransaction(t).txn.txID())
    await algodClient.sendRawTransaction(txns).do()

    const results = await Promise.all(txIDs.map(id => algosdk.waitForConfirmation(algodClient, id, 3)))
    return results
  }

async function pay() {
    const suggestedParams = await algodClient.getTransactionParams().do()
    const from = (document.getElementById('sender') as HTMLSelectElement).value
    const to = (document.getElementById('receiver') as HTMLSelectElement).value
    const amount = 1E6 * parseFloat((document.getElementById('amount') as HTMLInputElement).value)

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to,
        amount,
        suggestedParams
    })

    const signedTxns = (await myAlgo.signTxns([txn])).map(t => t.blob)
    console.log(await sendTxns(signedTxns))
}

document.getElementById('connect').onclick = connect
document.getElementById('rekey').onclick = rekey
document.getElementById('pay').onclick = pay