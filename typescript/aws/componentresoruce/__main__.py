import utils
import pulumi
from pulumi_aws import eks
import cluster

# pip install the compennt resource form your git repo of coice:
# pip install git+https://github.com/path/to/supercoolcomponentresource

#import supercoolcomponentresource


# Declare some vars and assign sane defaults as needed
config = pulumi.Config()
service_name = config.get('service_name') or 'foo'
team_name = config.get('team_name') or 'test'
nodes_min = config.get('nodes_min') or 1
nodes_max = config.get('nodes_max') or 1
nodes_norm = config.get('nodes_norm') or 2

# Create a cluster, and yes I am making a cluster per service a la ECS here
ekscluster=cluster.ClusterCompnent(f'{team_name}-{service_name}', cluster.clusterArgs(
    
))


pulumi.export('cluster-name', ekscluster.eks.name)
pulumi.export('kubeconfig', utils.generate_kube_config(ekscluster))