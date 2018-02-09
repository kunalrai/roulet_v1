USE [asiagameking_db]
GO

/****** Object:  Table [dbo].[games]    Script Date: 05-02-2018 08:56:12 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
if exists(select * from sys.objects where type = 'u' and name ='Receivables')
begin
 drop table Receivables

end
Create TABLE [dbo].Receivables(
	[id] [uniqueidentifier] NOT NULL,
	from_member_id [uniqueidentifier] NOT NULL,
	[amount] [int] not NULL,
	[access_level] [int] not NULL,
	[received_on] datetime not NULL,
 CONSTRAINT [PK_Receivables] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

if exists(select * from sys.objects where type = 'u' and name ='Transferable')
begin
 drop table Transferable

end
Create TABLE [dbo].Transferable(
	[id] [uniqueidentifier] NOT NULL,
	from_member_id [uniqueidentifier] NOT NULL,
	[amount] [int] not NULL,
	[access_level] [int] not NULL,
	[Transfer_on] datetime not NULL,
 CONSTRAINT [PK_Transferable] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
if exists(select * from sys.objects where type = 'u' and name ='DrawDetails')
begin
 drop table DrawDetails

end
Create TABLE [dbo].DrawDetails(
	[id] [uniqueidentifier] NOT NULL,
	DrawNo [int] NOT NULL,
	[access_level] [int] not NULL,
	DrawTime datetime not NULL,
 CONSTRAINT [PK_DrawDetails] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


--Select GetUtcDate()