class Wallet {
    address = $state<string>("");
    isConnected =$state<boolean>(false);

    async connect(){
		if (typeof window !== "undefined" && window.ethereum){
			try {
				const account = await window.ethereum.request({
					method: "eth_requestAccounts"
				})
				this.address = account[0]
                this.isConnected = true
			}
			catch(error){
				console.log("Error: ", error)
			}
		
		}
		else{
			alert("Please install the MetaMask extension to connect your wallet")
		}
	
    }

    
    disconnect(){
        this.address = ""
        this.isConnected = false
    }
}

export const wallet = new Wallet();