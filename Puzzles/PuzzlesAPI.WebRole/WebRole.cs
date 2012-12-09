// --------------------------------------------------------------------------------------------------------------------
// <copyright file="WebRole.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the WebRole type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.Diagnostics;
    using Microsoft.WindowsAzure.ServiceRuntime;

    public class WebRole : RoleEntryPoint
    {
        public override bool OnStart()
        {
            return base.OnStart();
        }
    }
}
