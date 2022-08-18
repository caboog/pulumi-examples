from pulumi import ComponentResource, ResourceOptions, 
from pulumi_aws import eks
# could just install eks

class clusterArgs:
    def __init__(self,
                 service_name=None,
                 team_name=None,
                 nodes_min=None,
                 nodes_max=None,
                 nodes_norm=None,
                 ):
            self.service_name = service_name
            self.team_name = team_name
            self.nodes_min = nodes_min
            self.nodes_max = nodes_max
            self.nodes_norm = nodes_norm


# Create a component resoruce for eks clusters
class ClusterCompnent(ComponentResource):
    eks: eks.Cluster
    kubeconfig: str # to expose just kubbeconfig, not the whole cluster config
    def __init__(self,
                 name: str,
                 args: clusterArgs,
                 opts =  ResourceOptions = None):
        # By calling super(), we ensure any instantiation of this class inherits from the ComponentResource class so we don't have to declare all the same things all over again.
        super().__init__('aws:eks/cluster:Cluster', name, None, opts)
        # This definition ensures the new component resource acts like anything else in the Pulumi ecosystem when being called in code.
        child_opts = pulumi.ResourceOptions(parent=self) # super important, keeps organization
        pulumi.mergeoptions
        cluster_name = f'{team_name}-{service_name}-eks'
        self.eks = eks.Cluster(
            cluster_name,
            desired_size=args.nodes_norm,
            max_size=args.nodes_min,
            min_size=args.nodes_max
        )
        self.kubeconfig = utils.generate_kube_config(self.ekscluster) # to expose just kubbeconfig, not the whole cluster config

## This is outdated and not needed
#self.register_outputs({
#    "clustername": eks_cluster.name,
#    "kubeconfig":  utils.generate_kube_config(eks_cluster)
#})
