Luke Jr [has been proposing](https://twitter.com/LukeDashjr/status/899401430330724354) lowering the maximum block size to 300mb in order to limit how long it takes a new node to sync up. He makes the good point that if processor power is growing at only 17%/year, that's how much we can grow the number of transactions a new node needs to verify on initial sync.

But limiting the blocksize is not the only way to do it. As I'm sure you can foresee from the title, I believe the best way to do it is a hardcoded checkpoint built into the software (eg bitcoin core). This is safe, this is secure, and it is a scalability improvement that has no downsides.

So what is a hardcoded checkpoint? This would consist of a couple pieces of data being hardcoded into the source code of any bitcoin full-node software. The data would be a blockheight, block hash, and UTXO hash. With those three pieces of information, a new client can download the block at that height and the UTXO set built up to that height, and then it can verify that the block and UTXO set are correct because they both have the correct hashes. 

This way, a new node can start syncing from that height rather than from the first block ever mined. What does this improve?

* Less storage - nodes don't need to store the entire historical chain through the eons. Just very recent blocks.
* Initial sync time is massively reduced
* Initial sync time would scale linearly with the transaction rate (whereas now it scales linear with number of total transactions).

While not strictly necessary, its likely that the UTXO data would come from the same source as the software, since otherwise full nodes would have to store UTXO sets at multiple block heights just in case someone asks for it as part of their checkpoint. Also, full-nodes should store block information going back historically significantly further than their checkpoint, so they have data to pass to clients that have an earlier checkpoint. So perhaps if a client is configured for a checkpoint 6 months ago, it should probably still store block data from up to 2 years ago (tho it wouldn't need to verify all that data - or rather, verifying it would be far simpler because the header chain connecting to their checkpoint 
block would all that needs to be validated).

To be perfectly clear, I'm absolutely not suggesting a live checkpoint beacon that updates the software on-the-fly from a remote source. That is completely unsafe and insecure, because it forces you to trust that one source. At any time, whoever controls the live source could disrupt millions of people by broadcasting an invalid block or a block on a malicious chain. So I'm NOT suggesting having a central source, or even any distributed set of sources, that automatically send checkpoint information to clients that connect to it. That would 100% be unsafe. What I'm suggesting is a checkpoint hardcoded into the software, which can be safely audited.

So is a hardcoded checkpoint safe and secure? Yes it is. Bitcoin software already needs to be audited. That's why you should never use bitcoin software that isn't open source. So by including the three pieces of data described above, all you're doing is adding a couple more things that need to be audited. If you're downloading a bitcoin software binary without auditing it yourself, then you already take on the risk of trusting the distributor of that binary, and adding hardcoded checkpoints does not increase that risk at all. 

However, most people can't even audit the bitcoin software if they wanted to. Most people aren't programmers and can't feasibly understand the code. Not so for the checkpoints. The checkpoints could easily be audited by anyone who runs a full node, or anyone who can check block hashes and UTXO hashes from multiple sources they trust. Auditing the hardcoded checkpoint would be so easy we could sell T shirts that say "I helped audit Bitcoin source code!"

The security profile of a piece of bitcoin node software with hardcoded checkpoints or without hardcoded checkpoints is identical. Not similar. Not almost. Actually identical. There is no downside.

Imagine this twice-a-year software release process:

Month 0: After the last release, development on the next release start (or rather, continues). 

Month 3: The next candidate version of the software is finalized, including a checkpoint from some non-contentious distance ago, say 1 month ago. 

Month 6: After 3 months of auditing and bug fixing, the software is released. At this point, the checkpoint would be 4 months old. 

In this process, downloading the latest version of bitcoin software would mean the maximum months of blocks you have to sync is 10 months (if you download and run the software the day before the next release happens). This process is safe, its secure, its auditable, and it saves tons of processing time and harddrive space. This also means that it would allow bitcoin full nodes to be run by lower-power computers, and would allow more people to run full nodes. I think everyone can agree that outcome would be a good one. 

So why do we **need** this change? ~~Because 300kb blocks is the alternative. That's not enough space, even with the lightning network.~~ I'm redacting the previous because I don't have the data to support it and I don't think its necessary to argue that we need this change. 

So why do we **need** this change? This change represents a substantial scalability improvement from O(n) to O(Δn). It removes a major bottleneck to increasing on-chain transaction throughput, reducing fees, increasing user security as well as network-wide security (through more full nodes), or a combination of those. 

What does everyone think?

**Update:**

I think its useful to think of 4 different types of users relevant in the hypothetical scenario where Bitcoin adopts this kind of proposal:

1. **Upfront Auditors** - Early warnings
2. **After-the-fact Auditors** - Late warnings
3. **Non-full-auditors** - Late warnings
4. **Non full nodes** - No warnings

Upfront auditors look at the source code of the software they use, the keep up to date with changes, and they make sure that what they're running looks good to them. They're almost definitely building directly from source code - no binaries for them. They'll alert people to a problem potentially *before* buggy or malicious software is even released. In this scenario, their security is obviously unchanged because they're not taking advantage of the check-pointing feature. We want to encourage as many people as possible to do this and to make it as easy as possible to do.

After-the-fact Auditors want to start a new node and start using Bitcoin immediately. They want to audit, but are ok with a period of time where they're trusting the code to be connecting the chain they want. They take on a slight amount of personal risk here, but once they back-validate the chain, they can sound the alert if there is a validation problem. 

Non-full-auditors are simply content to trust that the software is good. They'll run the node without looking at most or any of the code. They take on more risk than After-the-fact Auditors, but their risk is not actually much worse than After-the-fact Auditors. Why? Because as soon as you're sure you're on the right chain (ie you do a few monetary transactions with people who accept your bitcoin), you're golden for as long as you use that node and the part of the chain it validated. The can also still help the network to pretty much the same degree as After-the-fact Auditors, because if there are a problem with their transactions, they can sound the alarm about a problem with that software.

Non full nodes obviously have less security and they don't help the network. 

So why did I bother to talk about these different types of users? 

Well, we obviously want as many Upfront auditors as possible. However, doing that out of the starting gate is time consuming. It takes time to audit the code and time to sync the blockchain. Its costly. For this reason, for better or worse, most people simply won't do it. 

Without checkpoints, we don't have type 2 or type 3 users. The only alternative to being an Upfront Auditor is to be an SPV node that doesn't help the network and is less secure. With checkpoints, we could potentially change many of those people who would just use SPV to doing something much more helpful for the network. 

One of the huge benefits of After-the-fact Auditors and Non-full-auditors is that once they're on the network, they can act like Upfront Auditors in the next release. Maybe they're not auditing the source code, but they can sure audit the checkpoint very easily. That means they can also sound the alarm *before* malicious or broken software is released, just like Upfront Auditors. Why? Because they now have a chain they believe to be the true one (with an incredibly high degree of confidence).

What this means is that Upfront Auditors, After-the-fact Auditors, and Non-full-auditors help the network to a very similar degree. If software that doesn't sync to the right chain, they will find out about it and alert others. Type 2 and 3 take on personal risk, but they don't put the network at greater risk, like SPV nodes do. 

If we can convert most Non-full nodes into Type 2 or Type 3 users, that would be massive gain for the security of Bitcoin. Luke Jr said it himself, making nodes that support the network as easy as possible to run is critical. This is one good way to do that.

**Update 2**: Comparison to -assumevalid and why using checkpoints upgrades scalability

The -assumevalid option allows nodes to skip validation of blocks before the hardcoded golden block hash. This is similar to my proposal, but has a critical difference. A node with -assumevalid on (which I've heard is the default now) will still validate the whole chain in the case that a longer chain is floating around. Because of this, -assumevalid can be an optimization that works as long as there's no other longer chain also claiming to be bitcoin floating around the network.

The important points brought up by the people that wrote and discussed adding this feature was that:

A. Its not a change in security model, and

B. Its not a change in consensus rules.

This meant that it was a pure implementation detail that would never and could never change what chain your node follows.

The checkpoints I'm describing are different. On point A, some have said that checkpoints are a security model change, and I've addressed that above. I'd like to add that there is no way for bitcoin to be 100% trustless. That is impossible. Bitcoin at the deepest level is a specified protocol many people have agreed to use together. In order to join that group even on the most fundamental level, you need to find the spec people are agreeing to use. You have to trust that the person or people that gave you a copy of that spec gave you the right one. If different people claim that different specs are "bitcoin", you have to choose which people to trust. The same is true of checkpoints. New entrants want to join the network that the people they care about interacting with believe is Bitcoin, and those are the people they will trust to get the spec, or the source code, or the hash of the UTXO set. This is why I say the security profile of Bitcoin with checkpoints is identical to Bitcoin without checkpoints. The amount of trust you have to put in your social network is not materially different. 

While its not a security model change, as I've supported above, using checkpoints is consensus rules change. Every new checkpoint would change the consensus rules. However, I would argue this isn't a problem as long as those checkpoints are at a non-contentious number of blocks ago. While it would change consensus rules, it should *not* change consensus at all. There are 4 scenarios to consider:

I. There's no contention. 

II. There's a long-range reorg from before the checkpoint. 

III. There exists a contentious public chain that branched before the checkpoint would usually be taken. 

IV. There exists an invalid chain that's longer than the valid chain.

In case I, none of it matters, and checkpoints have pretty much exactly the same result as -assumevalid.

In case II, Bitcoin has much bigger problems. Its simply unacceptable for Bitcoin to allow for long-range reorgs, so this case must be prevented entirely. The downsides of a long-range reorg for bitcoin without checkpoints is MUCH MUCH larger than the additional downsides with checkpoints.

In case III, the obvious solution is to checkpoint from an earlier non-contentious blockheight, so nodes validate both chains. 

Case IV is where things really differ between checkpoints and -assumevalid. In this case, nodes using a checkpoint will only validate blocks after the checkpoint. However, nodes using -assumevalid will be forced to validate both chains back to their branch-point. 

I don't believe there are other relevant cases, but as long as checkpoints are chosen from non-contentious heights and have time to be audited, there is no possibility that honestly-run bitcoin software would in any way affect the consensus for what chain is the right chain.

This brings me back to why checkpoints upgrades scalability, and -assumevalid does not. Case IV is the case that prevents -assumevalid from being a scalability improvement. You want new nodes to be able to sync to the network relatively quickly, so say the 90th percentile of machines should be able to do it in less than a week (or maybe we want to ensure sync happens within a day - that's up for debate). With checkpoints, invalid chains branched before the checkpoint will not disrupt new entrants to the network. With -assumevalid, those invalid change will disrupt new entrants. Since an invalid chain can have branched arbitrarily far in the past, this disruption could be arbitrarily large. 

One way to deal with this is to ensure that most machines can handle validating not only the whole valid chain, but the whole invalid chain as well. The other way to deal with this is checkpoints. 

So back to scalability, with checkpoints all we need to ensure is that the lowest power machines we want to support can sync in a timely manner back to the checkpoint.