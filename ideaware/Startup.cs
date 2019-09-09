using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ideaware.Startup))]
namespace ideaware
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
