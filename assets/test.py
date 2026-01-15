import sys

print(sys.argv)

with open(sys.argv[1], "r") as file:
    lines = file.readlines()
    prev_vt = ""
    for line in lines:
        line = line.strip()
        if line.startswith("vt "):
            prev_vt = line
        if line.startswith("v "):
            vt = prev_vt[2:].split(" ")
            line = 'v ' + vt[1] + ' -0.45 ' + vt[2] + ''
            #line = 'v 1 ' + prev_vt[2:]
            #line = 'v -1 ' + prev_vt[2:]
            #line = 'v ' + prev_vt[2:] + ' -1'
        if line.startswith("vn "):
            line = 'vn 0 0 1'
        print(line)
        #print(line.strip())