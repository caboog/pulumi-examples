using Pulumi;
using System.Collections.Generic;
using AzureAD = Pulumi.AzureAD;


return await Pulumi.Deployment.RunAsync(() =>

{


        var demoAdministrativeGroup = new AzureAD.Group("DemoAdministrativeGroup", new()
    {
        DisplayName = "DemoGroup",

        SecurityEnabled = true,
    });

    var demoAdministrativeUnit = new AzureAD.AdministrativeUnit("demoAdministrativeUnit", new()
    {
        DisplayName = "Demo-AU",
    });

    var demoAdministrativeUnitMember = new AzureAD.AdministrativeUnitMember("demoAdministrativeUnitMember", new()
    {
        AdministrativeUnitObjectId = demoAdministrativeUnit.Id,
        MemberObjectId = demoAdministrativeGroup.Id,
    });


});

