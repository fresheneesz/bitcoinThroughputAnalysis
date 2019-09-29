var stats = require("../proofOfTimeOwnership/findKInN")

console.log("The probability that at least k out of n connections connects to an "+
                "honest node in the face of a Sybil attack:\n");

var k = 2
var attackerNodes = 100*1000
var connections = 8

connectionsProbability(k,8, attackerNodes,       9000, connections)
connectionsProbability(k,800, attackerNodes,     9000, connections)
connectionsProbability(k,8,   attackerNodes, 900*1000, connections)
connectionsProbability(k,80,  attackerNodes,  90*1000, connections)
connectionsProbability(k,80,  attackerNodes, 900*1000, connections)

function connectionsProbability(k, n, attackerNodes, honestNodes, connections) {
    var attackerNodesDisplay = (attackerNodes/1000/1000)+" million"
    var honestNodesDisplay = (honestNodes/1000)+" thousand"
    var honestFraction = honestNodes/(honestNodes+attackerNodes)
    console.log("k: "+k+", n: "+n+", attacker nodes: "+attackerNodesDisplay+", honest nodes: "+honestNodesDisplay)
    var probabilityOfMinimumHonestConnections = stats.findAtLeastKInN(k,n, honestFraction)
    
    console.log("Probability of "+k+" honest connections: "+percent(probabilityOfMinimumHonestConnections))
    
    var probabilityOfEclipse = Math.pow(Math.pow(1-honestFraction, connections), connections)
    console.log("Probability of eclipse: "+percent(probabilityOfEclipse)+'\n')
}

function percent(x) {
    return (x*100).toPrecision(4)+'%\n'
}