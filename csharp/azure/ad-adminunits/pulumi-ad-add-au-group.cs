// using System.Collections.Generic;
// using Pulumi;
// using AzureAD = Pulumi.AzureAD;

// return await Deployment.RunAsync(() => 
// {
//     var exampleUser = AzureAD.GetUser.Invoke(new()
//     {
//         UserPrincipalName = "jdoe@hashicorp.com",
//     });

//     var exampleAdministrativeUnit = new AzureAD.AdministrativeUnit("exampleAdministrativeUnit", new()
//     {
//         DisplayName = "Example-AU",
//     });

//     var exampleAdministrativeUnitMember = new AzureAD.AdministrativeUnitMember("exampleAdministrativeUnitMember", new()
//     {
//         AdministrativeUnitObjectId = exampleAdministrativeUnit.Id,
//         MemberObjectId = exampleUser.Apply(getUserResult => getUserResult.Id),
//     });

// });