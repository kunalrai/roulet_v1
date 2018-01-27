using System;
using System.Security;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

public class UsersIdentity : MarshalByRefObject, System.Security.Principal.IIdentity
{

    private readonly FormsAuthenticationTicket _ticket;
    private readonly Guid id;
    private readonly string name;
    private readonly string scope;

    public UsersIdentity(FormsAuthenticationTicket ticket)
    {
        
    }

    public string AuthenticationType
    {
        get { return "Forms"; }
    }

    public bool IsAuthenticated
    {
        get { return true; }
    }

    public Guid Id {
        get {
            return this.id;
        }
    }

    public String Name {
        get {
            return this.name;
        }
    }

    public String Scope {
        get {
            return this.scope;
        }
    }

}

