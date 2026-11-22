import json,re,subprocess,sys
runs=[(0.3,2.29),(2.87,5.1),(5.78,9.83),(9.98,11.08),(11.78,14.06),(14.96,16.21),(16.54,18.25),(18.88,19.87),(20.13,21.29),(21.94,23.08),(23.42,24.61),(24.96,26.53),(27.21,30.72),(31.44,34.14),(34.26,35.11),(35.74,36.98),(37.48,39.21),(39.67,41.62),(42.07,43.22),(43.52,44.78),(45.18,46.63),(47.07,49.21),(49.76,53.22),(53.66,57.09),(57.68,62.21),(62.55,64.36),(64.9,68.19),(68.67,69.29),(69.56,70.89),(71.29,72.98),(73.16,74.84),(75.57,76.87),(77.16,77.73),(77.85,78.57),(79.04,80.93),(81.36,83.06),(83.4,84.88),(85.18,86.56),(87.01,87.54),(87.68,88.29),(89.07,91.57),(91.89,94.75),(95.22,96.87),(97.26,98.38),(98.75,101.38),(101.83,104.74),(105.31,106.98),(107.34,111.37),(111.99,113.23),(113.57,114.75),(115.07,116.03)]
S=["Dangote Cement has a problem.","Not enough Africans can afford to build.","The continent consumes only 140 kilograms of cement per person per year.","Developed markets consume five times that.","The demand is not missing.","It is locked behind financing.","High interest rates.","Impossible collateral.","Millions want to build.","Millions cannot borrow.","So the capacity sits idle.",
"What if Dangote stopped waiting for customers and started creating them.","Dangote Home Finance acquires mortgage banks across the continent.","Abbey Bank in Nigeria.","SA Home Loans in South Africa.","First Housing Finance in Tanzania.","Zambian Home Loans.","BCH in Congo.","GGB Bank in Ghana.","These are customer acquisition machines.",
"Dangote Home Finance guarantees loans issued through these banks.","It holds 24 months of repayment obligations as collateral.","This guarantee convinces Euro-area banks to lend at 3.54 percent instead of 25 percent.","The European lender takes zero risk for the first two years.","In exchange, the borrower gets a home.","And Dangote gets a customer who must use Dangote cement.",
"When a borrower defaults, DHF pays the lender.","The property is auctioned to a new buyer.","That buyer continues the payment.","The cement was already sold.","The capital is recycled.","The cycle continues.",
"Because DHF operates through the banks it owns, funds are disbursed directly to approved contractors.","The borrower never touches the money.","The cement flows.","Sales are locked in before the foundation is poured.","One million homes means one million cement orders.","This is not development aid.","This is a demand generation engine disguised as a mortgage company.",
"Dangote Home Finance.","We are not selling loans.","We are selling cement."]
# syllable-ish weight: words + 0.35*extra chars
def wt(s): return sum(1+max(0,len(w)-5)*0.18 for w in re.findall(r"[\w'.%-]+",s))
W=[wt(s) for s in S]; tot=sum(W)
sp=sum(b-a for a,b in runs)
# cumulative speech time -> real time
def real(c):  # c in speech seconds
    for a,b in runs:
        if c<=b-a: return a+c
        c-=b-a
    return runs[-1][1]
cum=0;bounds=[]
for i,w in enumerate(W):
    s0=cum/tot*sp; cum+=w; s1=cum/tot*sp
    bounds.append([real(s0),real(s1)])
# snap boundaries to gap midpoints
gaps=[((runs[i][1]+runs[i+1][0])/2,runs[i+1][0]-runs[i][1]) for i in range(len(runs)-1)]
for i in range(1,len(S)):
    b=bounds[i][0]
    cand=[g for g in gaps if abs(g[0]-b)<1.1]
    if cand:
        g=max(cand,key=lambda g:g[1]-0.6*abs(g[0]-b)); 
        bounds[i-1][1]=g[0]-g[1]/2+0.0; bounds[i][0]=g[0]+g[1]/2
for i,(s,b) in enumerate(zip(S,bounds)): print(f"{i+1:2d} {b[0]:6.2f}-{b[1]:6.2f}  {s}")
json.dump([{'i':i+1,'t0':round(b[0],2),'t1':round(b[1],2),'text':s} for i,(s,b) in enumerate(zip(S,bounds))],open('cues.json','w'),indent=1)
