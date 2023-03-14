import React, { useContext, useState } from "react";
import { Box, Button, Divider, FormControl, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Popover, Select, SwipeableDrawer, Tooltip, useTheme, Tab, Tabs, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { AppContext } from "../../context/main";
import { TAccount } from "../../libs/types";
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, Signer } from "@solana/web3.js";
import OpacityIcon from '@mui/icons-material/Opacity';

// fixes the "Buffer is not defined" error
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

export default function Wallet() {

    const { workspace } = useContext(AppContext);
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setOpen(open);
        };

    const [sender, setSender] = useState<TAccount>();
    const [receiver, setReceiver] = useState<TAccount>();
    const [dropReceiver, setDropReceiver] = useState<TAccount>();
    const [amount, setAmount] = useState<number>(0);
    const [dropAmount, setDropAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(<div></div>);
    const [dropDialogOpen, setDropDialogOpen] = useState(false);
    const [dropDialogContent, setDropDialogContent] = useState(<div></div>);

    const handleSenderChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const account = workspace?.accountsAsArray.find((account) => account.keypair.publicKey.toString() === e.target.value);
        setSender(account);
    }

    const handleReceiverChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const account = workspace?.accountsAsArray.find((account) => account.keypair.publicKey.toString() === e.target.value);
        setReceiver(account);
    }

    const handleClose = () => {
        setDialogOpen(false);
        setDropDialogOpen(false);
        setDialogContent(<div></div>);
    };

    const linkStyle = {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightBold,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    };

    const sendLamports = async () => {
        setLoading(true);
        try {
            if (workspace?.RPC === undefined || sender === undefined || receiver === undefined) {
                return;
            }

            const connection: Connection = new Connection(workspace?.RPC);
            const senderPublicKey: PublicKey = sender?.keypair.publicKey;
            const receiverPublicKey: PublicKey = receiver?.keypair.publicKey;
            const senderBalance = await connection.getBalance(senderPublicKey);

            if (senderBalance <= amount) {
                setDialogContent(<>
                    Transaction failed. Not enough SOL to send!
                </>);
                setDialogOpen(true);
                setLoading(false);
                return;
            }

            if (isNaN(amount) || amount <= 0 || amount > 100) {
                setDialogContent(<>
                    Invalid Amount. Send more than 0 or less than 100 SOL.
                </>);
                setDialogOpen(true);
                setLoading(false);
                return;
            }

            if (senderPublicKey.toBase58() === receiverPublicKey.toBase58()) {
                setDialogContent(<>
                    Transaction failed. Pick different accounts!
                </>);
                setDialogOpen(true);
                setLoading(false);
                return;
            }

            // for debugging purposes
            console.log(`Wallets: ${senderPublicKey.toBase58()}, ${receiverPublicKey.toBase58()}`);
            console.log(`Sender Keypair: ${sender.keypair}: ${sender.keypair.publicKey.toBase58()} ${sender.keypair.secretKey}`);
            console.log("Amount to send: ", amount * LAMPORTS_PER_SOL);
            console.log("Sender balance: ", senderBalance);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: senderPublicKey,
                    toPubkey: receiverPublicKey,
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );

            await sendAndConfirmTransaction(connection, transaction, [sender.keypair]).then((signature) => {
                setLoading(false);
                setDialogContent(
                    <>
                        SOL tokens were sent successfully! Transaction details: <a href={`/txs/${signature}`} style={linkStyle}>link</a>.
                    </>
                );
                console.log(signature);
            }).catch((e) => {
                setLoading(false);
                setDialogContent(
                    <>
                        Transaction failed. Error message: {e}
                    </>
                );
                console.log("Error: ", e);
            });

        } catch (e) {
            setLoading(false);
            setDialogContent(
                <>
                    Transaction failed. Error message: {e}
                </>
            );
            console.error("Error: ", e);
        }

        setDialogOpen(true);
    };

    const requestAirdrop = async (value: number) => {
        setLoading(true);
        try {
            if (workspace?.RPC === undefined || receiver === undefined) {
                return;
            }

            const connection: Connection = new Connection(workspace?.RPC);
            const receiverPublicKey: PublicKey = new PublicKey(receiver?.keypair.publicKey);

            if (isNaN(value) || value <= 0 || value > 100) {
                setDropDialogContent(<>
                    Invalid Amount. Request for greater than 0 or less than 100 SOL.
                </>);
                setLoading(false);
                return;
            }

            setDropDialogContent(
                <>
                    Waiting for the transaction completion...
                </>
            );

            const signature = await connection.requestAirdrop(receiverPublicKey, value * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature).then(() => {
                setLoading(false);
                setDropDialogContent(
                    <>
                        Airdrop successful! Transaction details: <a href={`/txs/${signature}`} style={linkStyle}>link</a>.
                    </>
                );
            })
        } catch (e) {
            setDropDialogContent(
                <>
                    Airdrop failed. Error message: {e}
                </>
            );
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton onClick={toggleDrawer(!open)} color='primary'>
                <AccountBalanceWalletIcon fontSize="medium" />
            </IconButton>

            <SwipeableDrawer
                hideBackdrop
                anchor={'left'}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                PaperProps={{ sx: { backgroundColor: `#333` } }}
            >
                <Box
                    minWidth={'500px'}
                    maxWidth={'600px'}
                    height={'100%'}
                    pt={'70px'}
                    pl={'80px'}
                    pr={2}
                >
                    <Box display={'flex'} justifyContent={'end'}>
                        <Box
                            textAlign={'right'}
                            textTransform={'uppercase'}
                            fontSize={'1.1rem'}
                            fontWeight={700}
                            mt={0.4}
                            mr={2}
                            color={theme.palette.secondary.main}
                        >
                            <AccountBalanceWalletIcon fontSize="inherit" sx={{ mb: -0.3 }} /> Lava Wallet
                        </Box>
                        <Box>
                            <Tooltip title="Close Wallet" arrow placement="right" >
                                <IconButton color='secondary' size="small" onClick={toggleDrawer(false)}>
                                    <KeyboardArrowLeftIcon fontSize="medium" sx={{ fontSize: '1.4rem' }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box mt={2}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box>
                                <Stack
                                    direction="row"
                                    // justifyContent="center"
                                    spacing={0.5}
                                >
                                    <Tooltip title={'Native'}>
                                        <Button size="small" sx={{ py: 0, minWidth: 'unset' }}>
                                            NATIVE
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title={'SPL Tokens'}>
                                        <Button size="small" sx={{ py: 0, minWidth: 'unset' }}>
                                            SPL
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title={'NFT Assets'} sx={{ py: 0, minWidth: 'unset' }}>
                                        <Button size="small">
                                            NFT
                                        </Button>
                                    </Tooltip>
                                </Stack>
                            </Box>

                            <Box sx={{ py: 0, minWidth: 'unset' }}>
                                <Tooltip title={'Airdrop'}>
                                    <Button
                                        startIcon={<OpacityIcon fontSize={'inherit'} sx={{ fontSize: '0.6rem' }} />}
                                        size="small"
                                        onClick={() => {
                                            setDropDialogOpen(true);
                                            setDropDialogContent(<>Request test SOL tokens</>)
                                        }}
                                    >
                                        Airdrop
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }}></Divider>

                    <Box mt={2}>

                        {/* SENDER */}
                        <FormControl size="medium" fullWidth sx={{ my: 1.5 }}>
                            <InputLabel id="select-small-sender">Sender</InputLabel>
                            <Select
                                labelId="select-small-sender"
                                id="select-small-sender"
                                value={sender}
                                label="Sender"
                                onChange={(e) => {
                                    const selectedAccount = workspace?.accountsAsArray.find(account => account.keypair.publicKey.toString() === e.target.value);
                                    setSender(selectedAccount);
                                }}
                            >

                                {workspace?.accountsAsArray.map((account) => (
                                    <MenuItem key={account.alias} value={account.keypair.publicKey.toString()}>
                                        {account.keypair.publicKey.toString()}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>

                        {/* RECEIVER */}
                        <FormControl size="medium" fullWidth
                            sx={{
                                my: 1.5,
                                // backgroundColor: `${theme.palette.secondary.main}`,
                                color: `${theme.palette.text.primary}`
                            }}>
                            <InputLabel id="select-small-receiver">Receiver</InputLabel>
                            <Select
                                labelId="select-small-receiver"
                                id="select-small-receiver"
                                value={receiver}
                                label="Receiver"
                                onChange={(e) => {
                                    const selectedAccount = workspace?.accountsAsArray.find(account => account.keypair.publicKey.toString() === e.target.value);
                                    setReceiver(selectedAccount);
                                }}
                            >

                                {workspace?.accountsAsArray.map((account) => (
                                    <MenuItem key={account.alias} value={account.keypair.publicKey.toString()}>
                                        {account.keypair.publicKey.toString()}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>

                        {/* AMOUNT */}
                        <TextField fullWidth size="small" label="SOL Amount" id="amount" type="number" value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            inputProps={{
                                step: 0.001,
                                min: 0,
                                max: 100,
                            }}
                            sx={{ mt: 3 }}
                        />

                        {/* SEND BUTTON */}
                        <Button variant="contained" fullWidth sx={{ my: 1.5 }} disabled={loading} onClick={() => sendLamports()}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'SEND SOL'}
                        </Button>

                    </Box>
                </Box>
            </SwipeableDrawer>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>Transaction result:</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dropDialogOpen} onClose={handleClose}>
                <DialogTitle>SOL Airdrop:</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: 'center', fontSize: '20px' }}>
                        {<Box>
                            <FormControl size="medium" fullWidth sx={{ my: 1.5 }}>
                                <InputLabel id="receiver-label">Receiver</InputLabel>
                                <Select labelId="receiver-label" id="receiver-select" label="Receiver" value={dropReceiver} onChange={(e) => {
                                    const selectedAccount = workspace?.accountsAsArray.find(account => account.keypair.publicKey.toString() === e.target.value);
                                    setDropReceiver(selectedAccount);
                                }}
                                >

                                    {workspace?.accountsAsArray.map((account) => (
                                        <MenuItem key={account.alias} value={account.keypair.publicKey.toString()}>
                                            {account.alias}: {account.keypair.publicKey.toString()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField fullWidth id="amount" sx={{ my: 1.5 }} label="Amount" type="number" value={dropAmount}
                                onChange={(e) => setDropAmount(parseFloat(e.target.value))}
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 100,
                                }}
                            />

                            <Button fullWidth variant="contained" color="primary" size="large" disabled={loading} onClick={() => requestAirdrop(dropAmount)}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Airdrop'}
                            </Button>

                            <Box my={2} display="flex" justifyContent="center">
                                <Button sx={{ mx: 1.5 }} variant="contained" color="primary" disabled={loading} onClick={() => requestAirdrop(25)}>
                                    {loading ? <CircularProgress size={20} color="inherit" /> : '25 SOL'}
                                </Button>

                                <Button sx={{ mx: 1.5 }} variant="contained" color="primary" disabled={loading} onClick={() => requestAirdrop(50)}>
                                    {loading ? <CircularProgress size={20} color="inherit" /> : '50 SOL'}
                                </Button>

                                <Button sx={{ mx: 1.5 }} variant="contained" color="primary" disabled={loading} onClick={() => requestAirdrop(100)}>
                                    {loading ? <CircularProgress size={20} color="inherit" /> : '100 SOL'}
                                </Button>
                            </Box>
                        </Box>
                        }
                        {dropDialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    )

}