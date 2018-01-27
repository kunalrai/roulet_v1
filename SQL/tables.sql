s/****** Object:  Table [dbo].[depots]    Script Date: 02.07.2017 6:17:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[depots](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[zip] [int] NOT NULL,
	[shipping_charge] [money] NULL,
	[extra_charge] [money] NULL,
	[minimum_charge] [money] NULL,
 CONSTRAINT [PK_depots] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

/****** Object:  Table [dbo].[lead_notes]    Script Date: 02.07.2017 6:19:02 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[lead_notes](
	[id] [uniqueidentifier] NOT NULL,
	[lead_id] [uniqueidentifier] NOT NULL,
	[note] [nvarchar](max) NOT NULL,
	[user] [uniqueidentifier] NOT NULL,
	[created] [int] NOT NULL,
	[updated] [int] NOT NULL,
 CONSTRAINT [PK_lead_notes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

/****** Object:  Table [dbo].[lead_products]    Script Date: 02.07.2017 6:20:18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[lead_products](
	[id] [uniqueidentifier] NOT NULL,
	[lead_id] [uniqueidentifier] NULL,
	[product_id] [uniqueidentifier] NULL,
	[price] [money] NOT NULL,
	[distance] [float] NOT NULL,
	[shipping] [money] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

ALTER TABLE [dbo].[lead_products]  WITH CHECK ADD FOREIGN KEY([lead_id])
REFERENCES [dbo].[leads] ([id])
GO

ALTER TABLE [dbo].[lead_products]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO

/****** Object:  Table [dbo].[leads]    Script Date: 02.07.2017 6:21:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[leads](
	[id] [uniqueidentifier] NOT NULL,
	[no] [nvarchar](50) NOT NULL,
	[date_addet] [datetime2](7) NOT NULL,
	[responsobility] [uniqueidentifier] NULL,
	[source] [varchar](2) NULL,
	[firstname] [nvarchar](50) NOT NULL,
	[lastname] [nvarchar](50) NOT NULL,
	[company] [nvarchar](50) NOT NULL,
	[phone] [nvarchar](50) NOT NULL,
	[alt_phone] [nvarchar](50) NULL,
	[email] [nvarchar](50) NOT NULL,
	[sales_tax] [money] NULL,
	[discount_requested] [money] NULL,
	[customer_pickup] [bit] NULL,
	[expedite_requested] [bit] NULL,
	[lead_type] [nvarchar](50) NULL,
	[lead_rating] [int] NULL,
	[city] [varchar](50) NULL,
	[state] [nvarchar](3) NULL,
	[cms_status] [uniqueidentifier] NULL,
	[zip] [int] NOT NULL,
	[address] [varchar](128) NOT NULL,
 CONSTRAINT [PK_leads] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

/****** Object:  Table [dbo].[products]    Script Date: 02.07.2017 6:22:37 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[products](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](128) NOT NULL,
	[price] [money] NOT NULL,
	[discount] [money] NULL,
	[depots] varchar(MAX),
	[no] [varchar](50) NULL,
	[invoice] [money] NULL,
	[commission] [money] NULL,
	[enabled] [bit] NULL,
 CONSTRAINT [PK_products] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[products]  WITH CHECK ADD FOREIGN KEY([depot_id])
REFERENCES [dbo].[depots] ([id])
GO

/****** Object:  Table [dbo].[users]    Script Date: 02.07.2017 6:23:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[scope] [nvarchar](128) NULL,
 CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
