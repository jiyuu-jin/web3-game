/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';
import { ethers } from 'ethers';
import { createReadOnly, generateID, ProjectMeta } from '@valist/sdk';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from '../styles/Home.module.css'

const CreateGame = dynamic(() => import('../components/CreateGame'),
  { ssr: false }
);

const Home: NextPage = () => {
  const account = useAccount();
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [balance, setBalance] = useState<number>(0);
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>({});
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
  const valist = createReadOnly(provider, { chainId: 137 });
  const noToken = balance === 0;

  useEffect(() => {
    if (account?.address) {
      const accountID = generateID('137', 'webgame');
      const projectID = generateID(accountID, 'game');

      valist.getProductBalance(account?.address, projectID).then((_balance) => {
        console.log('_balance', balance);
        setBalance(Number(_balance.toHexString()))
      });

      valist.getProjectMeta(projectID).then((meta: ProjectMeta) => {
        setProjectMeta(meta);
      });
    }
  }, [account?.address]);

  const playFull = () => {
    if (!noToken) setShowMenu(false);
  }

  const playGuest = () => {
    setShowMenu(false);
  }
  
  return (
    <div>
      {showMenu && <div className={styles.menu}>
        <h1>Welcome to the Web3 Game!</h1>
        <div>
          <button onClick={playFull} style={{ marginRight: 10 }}>Play {noToken ? '(No token found)' : ''}</button>
        </div>
      </div>}
      <div style={{position: 'fixed', top: 20, right: 20, zIndex: 10}}>
        <ConnectButton />
      </div>
      {projectMeta?.image && <CreateGame skin={projectMeta.image} />}
    </div>
  )
}

export default Home;
