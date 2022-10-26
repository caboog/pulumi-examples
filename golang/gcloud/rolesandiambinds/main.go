package main

import (
	serviceAccount "github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/serviceAccount"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/organizations"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		prom, err := serviceAccount.NewAccount(ctx, "prom-frontend", &serviceAccount.AccountArgs{
			AccountId:   pulumi.String("prom-frontend"),
			DisplayName: pulumi.String("Service Account"),
		})
		if err != nil {
			return err
		}
		org, err := organizations.NewIAMBinding(ctx, "prom-frontend-bind", &organizations.IAMBindingArgs{
			Members: pulumi.StringArray{
				pulumi.String("serviceaccount:prom-frontend@experiments.iam.gserviceaccount.com"),
			},
			OrgId: pulumi.String("1223456789"),
			Role:  pulumi.String("roles/storage.admin"),
		})
		if err != nil {
			return err
		}
		ctx.Export("org", org.ID())
		ctx.Export("prom", prom.AccountId)
		return nil
	})
}