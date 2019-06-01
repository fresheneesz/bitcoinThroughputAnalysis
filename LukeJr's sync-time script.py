#!/usr/bin/python3
import sys

target = (2013, 14)

mode = sys.argv[1] if len(sys.argv) > 1 else 2000

if mode == 'temporary-300k':
	# 300k blocks from 2019 Aug 1 - Dec 31 only
	start_year = 2020
	start_blockchain_size = 268
	def blockchain_growth(t):
		return t * 105
elif mode == '300k-reduce':
	# 300k blocks beginning 2019 Aug 1
	start_year = 2020
	start_blockchain_size = 268
	def blockchain_growth(t):
		return t * 15.8
else:
	start_year = 2019
	start_blockchain_size = 200
	GB_per_year = int(int(mode) * 144 * 365.25 / 1e6)
	def blockchain_growth(t):
		return t * GB_per_year


def tech_growth(t):
	return 1.17 ** t

def blockchain_size(t):
	return blockchain_growth(t) + start_blockchain_size

def info(year):
	t = year - start_year
	cur_blockchain_size = blockchain_size(t)
	sync_time_a = cur_blockchain_size / (start_blockchain_size * tech_growth(t))
	sync_time_b = cur_blockchain_size / (target[1] * tech_growth(year - target[0]))
	print("Year: %s  Blockchain size: %5u  Sync time vs %s: %.02f  Sync time vs %s: %.02f" % (year, cur_blockchain_size, start_year, sync_time_a, target[0], sync_time_b))
	# Peak year, x start year time, x safe time
	# Return to 2019
	# Return to safe time

for y in range(2020, 2051):
	info(y)