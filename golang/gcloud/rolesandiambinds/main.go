package main

import (
	"fmt"

	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/projects"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/serviceaccount"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create a GCP resource (Storage Bucket)
		deps, err := serviceaccount.NewAccount(ctx, "naveen-deps-retriever",
			&serviceaccount.AccountArgs{
				AccountId:   pulumi.String("naveen-deps-dev-retriever"),
				Description: pulumi.String("Service account to retrieve dependencies from big query"),
				DisplayName: pulumi.String("naveen-deps-dev-retriever"),
				Project:     pulumi.String("pulumi-ce-team"),
			}, pulumi.Protect(true))
		if err != nil {
			return err
		}
		if _, err := projects.NewIAMBinding(ctx, "naveen-deps-dev-retriever", &projects.IAMBindingArgs{
			Members: pulumi.StringArray{
				pulumi.Sprintf("serviceAccount:%s", deps.Email),
			},
			Project: pulumi.String("pulumi-ce-team"),
			Role:    pulumi.String("roles/storage.admin"),
		}); err != nil {
			return err
		}

		if _, err := serviceaccount.NewIAMBinding(ctx, "naveen-deps-dev-retriever--workload-identity-iam-binding", &serviceaccount.IAMBindingArgs{
			Members:          pulumi.StringArray{pulumi.String(fmt.Sprintf("serviceAccount:%s.svc.id.goog[%s/metadataretriever-account]", "endor-experiments", "staging"))},
			Role:             pulumi.String("roles/iam.workloadIdentityUser"),
			ServiceAccountId: deps.Name,
		}); err != nil {
			return err
		}
		return nil
	})
}