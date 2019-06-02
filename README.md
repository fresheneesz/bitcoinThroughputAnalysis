**Status: WIP**

# Intro

Debate about growth of Bitcoin's blockchain has raged for years now. Some want to increase transaction throughput by increasing block size and call that "scaling". Others want to focus on technologies that improve (decrease) the resources necessary to run the network as it grows (actual scaling). However, I've found little analysis that attempts to analyze every major bottleneck in order to gain a broader picture of where we stand and the hurdles ahead. LukeJr gave [results of his analysis](https://www.youtube.com/watch?v=CqNEQS80-h4) that lowering the blocksize maximum to 300KB would allow us to maintain the current sync time, and would allow sync time to decrease slowly over the years. But this only discusses one bottleneck, and I have not been able to find the math and methodology he used to get those numbers.

# Overview

In order to analyse Bitcoin's maximum throughput, its necessary to choose some support-goals: basically what minimum system requirements do we want Bitcoin to support for various aspects of running the network. Once we choose goals, we can calculate the transaction throughput at which those goals are barely met for each major process necessary for users on the Bitcoin network to do. Here are some considerations:

1. We want as many people as practical to mine bitcoin.
2. We want many people to support the network by passing around transactions and blocks.
3. We want most people to be able to be able to fully verify their transactions so they have full self-sovereignty of their money.
4. We want to be resilient in the face of chain splits. For example, if a majority wants to change bitcoin in a way that a minority thinks is horribly compromises the system, its important that minority can maintain the operation of their chain in the face of a majority split.

These considerations are all affected by transaction throughput and blocksize.

\#1 is important to bitcoin, but is the least affected by increased block size, since miners are generally either large powerful server farms or large mining pools. Miners are unlikely to drop out of bitcoin because of even many orders of magnitude more transactions.

\#2 is important, but we don't need everyone to do it - just a critical mass. As long as even 5% of the network is honest and passes around data, the network can be supported during normal operation.

\#3 This one is most affected by blocksize changes. SPV nodes are very tempting as they come up almost instantly, don't require any major harddrive space or processor usage, and also give close-to-full-node security using SPV proofs. So the more painful it is to be a full node, the more people are going to use an SPV node instead.

\#4 In the case of a hard fork, SPV nodes won't know what's going on. They'll blindly follow whatever chain their SPV server is following. If enough SPV nodes take payments in the new currency rather than the old currency, they're more likely to acquiesce to the new chain even if they'd rather keep the old rules.

Some of the affects of a larger blocksize:

A. Users would need to store more data on their harddrive.

B. Users would need to use more bandwidth to download and upload more data from and to their peers.

C. Users would need to use more of their computer's CPU time and memory to verify transactions.

D. Users who can't do A, B, or C (or feel its not worth it) would not be able to run a full node, and would instead use a less intensive node like an SPV node.

# The State of Available Machine Resources

## Bandwidth

Taking a look at [the world's lowest ranking peak internet speeds](https://en.wikipedia.org/wiki/List_of_countries_by_Internet_connection_speeds), it gets down to 1.4 Mbps. And according to The International Telecommunication Union, the average bandwidth per user for the lowest ranking countries was [around 5 Kbps or lower in 2016](https://www.theglobaleconomy.com/rankings/Internet_bandwidth/). While in the future, we definitely would like Bitcoin to be able to reach the poorest of people, currently that's unrealistic, so I'll choose 1 Mbps as the speed available to the 90th percentile Bitcoin user.

The worlds internet speeds are increasing around 25%/year ([23% in 2015](https://www.akamai.com/us/en/multimedia/documents/content/state-of-the-internet/q4-2015-state-of-the-internet-connectivity-report-us.pdf), [26% in 2016](https://www.akamai.com/us/en/multimedia/documents/state-of-the-internet/q4-2016-state-of-the-internet-connectivity-report.pdf), [30% in 2017](https://www.speedtest.net/insights/blog/global-speed-2017/)).

## Hard drive space

I had a hard time finding data for disk space in the world, but I took a look at the [cheapest smartphones you can get in india](https://www.scoopwhoop.com/9-best-budget-smartphones-you-can-get-in-india-in-january-2019/) for an idea. The [Xiaomi Redmi Y2 specs](https://pricebaba.com/mobile/xiaomi-redmi-y2) can be bought for about 8,600 rupees ($120) and has 32GB of storage. This seems like a reasonable amount of storage to expect somone would have even in a poor country, given that you can get a 32GB SD card for $7 these days.

The cost of hard disk space is declining at a rate of [about 25%](https://www.backblaze.com/blog/hard-drive-cost-per-gigabyte/), tho that rate is declining.

## Memory and CPU speed

These I have far less information about because its difficult to know how many transactions a machine with some given specs could validate. I would [be curious](https://bitcoin.stackexchange.com/questions/87864/how-can-i-calculate-estimate-how-quickly-a-machine-can-verify-transactions-on-th) to know more. However, [Eric Kuhn mentioned](https://twitter.com/erickuhn19/status/1095553655086804993) that verifying the transactions can be a much larger bottleneck than downloading them. There are about [415 million transactions](https://www.blockchain.com/charts/n-transactions-total) in the bitcoin blockchain, and if it can take 25 days to verify everything, as Eric Kuhn mentioned, that means his raspberry pi could only verify about 192 tps.

Memory has been decreasing in cost by [about 15%/year](https://jcmit.net/memoryprice.htm), and cost of cpu power is decreasing at less than [20%/year](https://www.imf.org/~/media/Files/Conferences/2017-stats-forum/session-6-kenneth-flamm.ashx), so I'll use LukeJr's number of 17%/year for cost of CPU power.

## An aside about technological growth

The calculations done in this paper assume a constant exponential growth of machine resources for a given cost over time. However, in reality, the rate of growth has been shrinking, so the estimates here will be less accurate and overestimate limits more the further out in time they are extrapolated.

# Assumptions

In order to come up with hard numbers for throughput limits, I'm going to make some assumptions about Bitcoin's support goals and the state of people's computational resources.

I. The top 1% of Bitcoin users should be able to sync the entire chain back to the genesis block within 1 week using 75% of the resources of a machine they already own.

II. The top 10% of Bitcoin users should be able to validate and forward data through the network using at most 10% of the resources (bandwidth, disk space, memory, CPU time, and power) of a machine they already own.

III. 90% of Bitcoin users should be able to validate block and transaction data that is forwarded to them using at most 10% of the resources of a machine they already own.

IV. 90% of Bitcoin users should be able to start a new node and fully sync with the chain using assumevalid within 1 week using at most 75% of the resources of a machine they already own.

For the purposes of this analysis, I'm going to use the following estimates:

* The 1st percentile of Bitcoin useres have 1000 Mbps bandwidth, 10TB of disk space, 20 GB of memory, enough cpu power to verify 50,000 transactions per second, and enough power that it isn't an issue.
* The 10th percentile of Bitcoin users have 50 Mbps bandwidth, 1TB of disk space, 8 GB of memory, enough cpu power to verify 5,000 transactions per second, and enough power that it isn't an issue.
* The 90th percentile of Bitcoin users have 1 Mbps bandwidth, 128GB of disk space, 2 GB of memory, enough cpu power to verify 200 transactions per second, and enough power that it isn't an issue (this assumption should probably be reconsidered).

# Bottlenecks

## Initial Block Download

The time it will take to download the necessary parts of the blockchain at a given date can be given by:

`curDlSpeed * speedGrowth^t * dlTime - chainSize = 0`

where

* `curDlSpeed` is the download speed.
* `t` is how long in the future the download is taking place.
* `speedGrowth` is the percentage growth of `curDlSpeed`.
* `dlTime` is the time it takes to download the chain.
* `chainSize` is the blockchain size.

Solving for size:

`chainSize = curDlSpeed * speedGrowth^t * dlTime`

Integrating to find the rate of change in size:

`chainSize' = curDlSpeed * ln(speedGrowth) * speedGrowth^t * dlTime`

The maximum size of the blockchain that can be downloaded by our 90th percentile users at time t can be found using the following parameters:

* `curDlSpeed = (1000 Kbps)*.75 = 750 Kpbs = 94 KB/s`
* `speedGrowth = 125% = 1.25`
* `dlTime = 1 week = 7*24*60*60 seconds `

`maxSize = 94 KB/s * 1.25^t * 1 week = 94*1.25^t*(7*24*60*60)/10^6 GB`

The maximum throughput our 90th percentile users can manage at that maximum size at a given time `t` is:

`size' = 94 KB/s * ln(1.25) * 1.25^t * 1 week = 94*1.25^t*(7*24*60*60)/(365*24*60*60) KB/s`

INSERT TABLE AND CHART


## Initial Sync Validation (without assumevalid)

First, I'll do this without the benefit of assumevalid, since some people believe the only way to be sure you're on the right chain is to download validate the entire thing. The equation to find how many transactions we can process to meet a given sync-time requirement is (see Appendix A for derivation):

`tpps * speedGrowth^t * syncTime - transactions = 0`

where

* `tpps` is the number of transactions processed per second by the node
* `speedGrowth` is the percentage growth of `tpps`.
* `t` is how long in the future the download is taking place.
* `syncTime` the time it will take to sync.
* `transactions` is the number of transactions to validate.

Solving for transactions:

`transactions = tpps * speedGrowth^t * syncTime`

Integrating to find the rate of change in transactions:

`transactions' = tpps * ln(speedGrowth) * speedGrowth^t * syncTime`


## Initial Sync Validation (using assumevalid)

With [assumevalid](https://bitcoinmagazine.com/articles/bitcoin-core-0140-released-whats-new/), not all transactions in the chain need to be validated. I'll assume a hypothetical 6-month software release cycle, where the assumevalid block is chosen 1 month before release, which means a new client with correct software will only need to validate blocks up to 7 months into the past. I'll assume that avoiding validating transaction signatures saves 90% of the transaction processing time (some processing is still needed to build the UTXO set). In practice, assumevalid gives approximately a [50% transaction-validation time reduction](https://www.reddit.com/r/Bitcoin/comments/5xomir/0140_is_a_beast_48_faster_initial_sync/) (ie a 100% speedup).

Because the equations for blockchain size using assumevalid aren't solvable for the number of transactions over time(see Appendix A), I decided to solve the numbers with guess and check in excel. Basically I have a starting point for the blockchain size and transaction throughput, from which I calculate the number of recent transactions not assumed valid, the number of old transactions assumed valid. I also calculated a number that I called the "Adjusted Equivalent Transactions", which is the number of transactions that a node could process without the benefit of assumevalid in the same amount of time that a node could process the full (non adjusted) transactions. From that adjusted value, I calculated the syncTime. Each subsequent blockchain size is calculated from the transaction throughput the previous year, and I played around with each year's throughput so that the syncTime was about 7 days for each year.

Since there's multiple solutions to this, I cacluated one set of solutions using the current blockchain size and a second set of solutions using the current throughput. They ended up having somewhat similar numbers. For starting at the current blockchain size of  415 million transactions, the maximum throughput is 4.9 tps or the equivalent of about 735 KB blocks. For a starting point of the current throughput of about [4.2 transactions/second](https://www.blockchain.com/en/charts/transactions-per-second?timespan=all&daysAverageString=7) which translates to blocks of about 1.2 MB, the maximum blockchain size is about 530 transactions (about 25% more than the blockchain contains). This means that by using assumevalid to avoid validating old transactions, Bitcoin is currently at a healthy size and growth rate as far as transaction processing is concerned.


## Ongoing Transaction and Block Downnload

Our 90th percentile users need to download transasctions and blocks on an ongoing basis.


## Ongoing Transaction Validation

Our 90th percentile users need to validate transasctions on an ongoing basis.


## UTXO Set Disk Usage

Since for the purposes of this analysis, our 90th percentile users don't need to upload blocks to other peers, they can simply use the pruning option to discard old blocks as soon as they're validated, and the only major data needed would be the UTXO set. As of 2017, the UTXO set required [about 3GB](https://eprint.iacr.org/2017/1095.pdf), well within the capabilities of our 90th percentile user. Since the number of transaction mined per second is not directly related to UTXO growth, there's no clear way to relate these. However, the UTXO set size grew at a rate of [about 75%/year](https://charts.bitcoin.com/bch/chart/utxo-set-size#74) between 2015 and 2017, and that has been somewhat representative, despite the drop in UTXO size in the last year. The trend does look like its slowing, so it is probably safe to assume a near-term growth of 50%/year. At that rate its size would pass the target 12.8GB of disk space (10% of the amount our 90th percentile user has) within 4 years. So this is definitely something to watch out for becoming a problem in the near future.

However, another thing to note is that the UTXO set can't grow in megabytes faster than the blockchain grows. So the block size is a limiting factor on the maximum growth of the UTXO set.


## UTXO Set Memory Usage

According to [out of date information](http://gavinandresen.ninja/utxo-uhoh), the UTXO set is about 6.4 times the size of the form as it exists on disk. At the same time, the entire UTXO set doesn't need to be stored in memory, but the less a node keeps in memory, the slower it'll validate transaction on average. The current default for --dbcache is [450 MB](https://github.com/bitcoin/bitcoin/blob/452bb90c718da18a79bfad50ff9b7d1c8f1b4aa3/doc/release-notes/release-notes-0.14.1.md). For this analysis, I've assumed that keeping 2.3% (450 MB / 3 GB) of the UTXO set in memory is a near-optimal tradeoff (doesn't lose you significant validation speed).

With these assumptions, the maximum UTXO size is already higher than limits for our 90th percentile user by a factor of 3, and we can only expect this to get worse over time.


## Blockchain & UTXO disk usage

Since our 10th percentile users do currently need to store the whole blockchain, they'll need to store not only the UTXO set but the blockchain as well.

Currently, the maximum blockchain size that can fit in 10% of our 10th percentile user's 1 TB of disk space is 97 GB (plus 3 GB of UTXO), and the maximum throughput would be 1.6 tps with 450 KB blocks. So we are currently not meeting the goals here.





## Cheap computers and bad service

Slow computers on bad internet connections in poor countries are the major bottleneck to achieving the goals I listed. If we want 90% of the world to be able to use Bitcoin in the fullest sense (pun intended), then we have to make sure the software can handle what it needs to handle on the 90th percentile of computer power and network bandwidth.

We don't need the people with the worst equipment to mine (#1), and we might not even need them to support the network (#2) very much, but we do want them to be able to be able to fully verify their own transactions (#3), and we want them to be able to know what chain they're on (#4).

# Bandwidth used by receiving transactions

Since the [average transaction size](https://bitcoinvisuals.com/chain-tx-size) is around 475 bits, a 1.4 Mbps connection could manage to receive around 5600 transactions per second (as long as its not also uploading).


# Problems

## We can't expect dedicated nodes

Not everyone can afford a dedicated node that uses 100% of its bandwidth/cpu/memory on bitcoin. We can reasonably expect that maybe 10% of a machine's resources go to bitcoin. What this means is that our 1.4 Mbps number above is cut down to 140 Kbps, or 560 transactions per second.

# Summary of the Current State of Bitcoin

This is a list in order of tightest to widest bottleneck in Bitcoin throughput. Each is named and given a value that it limits the blocksize to:

1. Initial Block Download for 90th percentile users - 57GB max chain size, 25%/year max growth
2. ~~Initial Sync Validation (without assumevalid) for 90th percentile users - 120 million max transactions @ 18%/year max growth, 20 tps max.~~ This is already solved by assumevalid
3. Initial Sync Validation (using assumevalid) for 90th percentile users - 120 million max transactions @ 18%/year max growth, 20 tps max
4. Blockchain storage for 90th percentile users - 12.8GB max UTXO size, 25%/year max growth

Disk space used by storing the UTXO set
Disk space used by storing the Blockchain
Memory used by the UTXO set
Ongoing transaction validation

# Summary of the Current State of Bitcoin

This is a list in order of tightest to widest bottleneck in Bitcoin throughput. Each lists maximum values for transactions per second, blocksize, and blockchain size.

1. Initial Block Download (for 90th%) - 1 tps, 241 KB blocks, max blockchain size: 57 GB (Goals cannot be met)
1. ~~Initial Sync Validation (for 90th% without assumevalid) - 0.5 tps, 430 KB blocks, max blockchain size: 91 million transactions.~~ This is already solved by using assumevalid.
1. Initial Sync Validation (for 90th% using assumevalid) - 2.87 tps 430.5 KB blocks, 
3. Ongoing Transaction and Block Download (for 90th%) - 
3. Ongoing Transaction Validation (for 90th%) - 
3. UTXO Set Disk Usage (for 90th%) - 
1. UTXO Set Memory Usage (for 90th%) - 
3. Blockchain & UTXO Disk Usage (for 10th%) - 
3. Ongoing Transaction Download & Upload (for 10th%) - 
3. Initial Sync Validation (for 1st%) - 


# Solutions


## Hard drive space

This doesn't need to be the bottleneck it might appear. What is important for full nodes is that they've verified past history, and that they can download the past history when they need it. It should be relatively simple to spread out blockchain storage in the distributed network. If every full node on the network stored 1/1000th of the blockchain, that 5.5 TB would really just be 5.5 GB per full node - very manageable even in poor countries these days.

And if software included hard-coded checkpoints every once in a while (eg say new bitcoin software versions hardcoded a block 6 months in the past), it would mean blocks before that checkpoint could be simply deleted from the network (offline archives would of course still keep the chain for posterity). That would mean that storage requirement would remain constant, rather than growing indefinitely.


## SPV nodes

SPV nodes do not validate blocks or transactions (other than SPV proofs they're passed) so they also don't pass around transactions or block data. They don't support the network. Again, this is ok as long as we have a critical mass that do support the network. However, they do consume resources.

# Problems

## We can't expect dedicated nodes

Not everyone can afford a dedicated node that uses 100% of its bandwidth/cpu/memory on bitcoin. We can reasonably expect that maybe 10% of a machine's resources go to bitcoin. What this means is that our 1.4 Mbps number above is cut down to 140 Kbps, or 560 transactions per second.


# Solutions

## Assume UTXO

https://github.com/bitcoin/bitcoin/issues/15605

## Hard drive space

This doesn't need to be the bottleneck it might appear. What is important for full nodes is that they've verified past history, and that they can download the past history when they need it. It should be relatively simple to spread out blockchain storage in the distributed network. If every full node on the network stored 1/1000th of the blockchain, that 5.5 TB would really just be 5.5 GB per full node - very manageable even in poor countries these days.

And if software included hard-coded checkpoints every once in a while (eg say new bitcoin software versions hardcoded a block 6 months in the past), it would mean blocks before that checkpoint could be simply deleted from the network (offline archives would of course still keep the chain for posterity). That would mean that storage requirement would remain constant, rather than growing indefinitely.


## SPV nodes

SPV nodes do not validate blocks or transactions (other than SPV proofs they're passed) so they also don't pass around transactions or block data. They don't support the network. Again, this is ok as long as we have a critical mass that do support the network. However, they do consume resources.



# Apendix A

 The equations dictating long it will take a node to sync the chain using assumevalid is similar to the one without assumevalid:

`transactions = tpps * speedGrowth^t * syncTime`

With the addition of:

`transactions = assumedValidTr*(1-assumeValidSpeedup) + nonAssumedValidTr

`nonAssumedValidTr = transactions' * assumeValidBlockTime`

where

* `transactions` is the number of transactions to validate.
* `tpps` is the number of transactions processed per second by the node.
* `assumedValidTr` is the number of transactions assumed to be valid at time `t`
* `nonAssumedValidTr` is the number of transactions to validate that happened before the assumevalid block. This assumes full blocks for that period.
* `assumeValidSpeedup` is the amount of work saved by using assumevalid
* `assumeValidBlockTime` is the amount of time between now and the timestamp of the assumevalid block
* `syncTime` the time it will take to sync

This results in the equation:

`(transactions - transactions' * assumeValidBlockTime)*(1-assumeValidSpeedup) + transactions' * assumeValidBlockTime = tpps * speedGrowth^t * syncTime`

This equation can be simplified somewhat by integrating both sides, but you end up with an equation of the form:

`x^2*a/2 + bx = c/ln(d) * d^t`

And that's not solvable for x (transactions), because there are multiple solutions for transactions and transactions', meaning that the max tps depends on how many transactions you start with in the blockchain. So instead I decided to solve the numbers with guess and check in excel.




















