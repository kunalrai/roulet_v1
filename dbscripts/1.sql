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
	gameId [uniqueidentifier] NOT NULL,
	from_member_id [uniqueidentifier] NOT NULL,
	to_member_id [uniqueidentifier] NOT NULL,
	[amount] [int] not NULL,
	[received_on] datetime not NULL,
	IsReceived bit not NULL,
	IsRejected bit not NULL,
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
	gameId [uniqueidentifier] NOT NULL,
	from_member_id [uniqueidentifier] NOT NULL,
	to_member_id [uniqueidentifier] NOT NULL,
	[amount] [int] not NULL,
	[Transfered_on] datetime not NULL,
	IsCancelled bit not NULL,
	IsReceived  bit not NULL
 CONSTRAINT [PK_Transferable] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
if exists(select * from sys.objects where type = 'u' and name ='DrawDetails')
begin
 truncate table DrawDetails
 drop table DrawDetails
end
Create TABLE [dbo].DrawDetails(
	[id] [uniqueidentifier] NOT NULL,
	userid [uniqueidentifier] NOT NULL,
	[gameid] [uniqueidentifier] NOT NULL,
	DrawNo [int] NOT NULL,
	
	DrawTime datetime not NULL,
 CONSTRAINT [PK_DrawDetails] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


--Select GetUtcDate()

----select * from games
--truncate table drawdetails
--select * from drawdetails
--select CONVERT (date, GETutcDATE()) 

--Select Row_Number() over(order by drawtime desc) SrNo, userid , gameid,drawno,drawtime from DrawDetails where DrawTime   >=  CONVERT (date, GETutcDATE()) 

----select * from users where id  ='5B56412A-B1C4-4177-B6CE-BFAE40968594'

--select * from games

--select * from Users where id ='5b56412a-b1c4-4177-b6ce-bfae40968594'

--select * from Users where main = '19F83DE7-609E-41B8-A7E8-47CF85FD2FD7'
 
 if exists( select 1 from (
 select * from Users 
 where main = (select main from users where id ='5b56412a-b1c4-4177-b6ce-bfae40968594' )
 and   id !='5b56412a-b1c4-4177-b6ce-bfae40968594'
  or 
 
 id = (select main from users where id ='5b56412a-b1c4-4177-b6ce-bfae40968594')


 )
  as t
 where id = '2EC105EE-4ADF-43F9-9A07-E4E15DBC7969'
 )

 begin
    select 1
 end
 else
 begin
   select 0
 end


--update users
--set pointuser= 100
--where id ='5b56412a-b1c4-4177-b6ce-bfae40968594'

--select * from Transferable

--insert into Transferable(id,from_member_id,gameId,to_member_id,amount,Transfered_on,IsCancelled,IsReceived) values(newid(),'5b56412a-b1c4-4177-b6ce-bfae40968594',
--'07FE02E9-5BA8-4BD1-8F72-B1DD4336418C','2EC105EE-4ADF-43F9-9A07-E4E15DBC7969',100,GETUTCDATE(),0,0)



Select  [id],[from_member_id],(select email from users where id = to_member_id) as to_member_id,[amount],
        [Transfered_on]
from Transferable 
where from_member_id   =  '5b56412a-b1c4-4177-b6ce-bfae40968594'
and gameid = '07FE02E9-5BA8-4BD1-8F72-B1DD4336418C'
and IsCancelled = 0 and IsReceived =0 



