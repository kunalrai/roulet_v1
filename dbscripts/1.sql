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


if exists(select * from sys.objects where type = 'p' and name ='savetransferables')
begin
drop procedure savetransferables
end


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE savetransferables
	-- Add the parameters for the stored procedure here
	@gameid nvarchar(36),
	@from_member_id nvarchar(36), 
	
	@to_member_id nvarchar(8),
	@amount int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if exists( select 1 from (
                         select * from Users 
                         where main = (select main from users where id =@from_member_id )
                         and   id !=@from_member_id
                          or 
 
                         id = (select main from users where id =@from_member_id)


                         )
                          as t
                         where email = @to_member_id
                         )

                         begin
                                
                                
                                INSERT INTO [dbo].[Transferable]([id],gameId,[from_member_id],to_member_id,[amount],
                                                     [Transfered_on],IsCancelled,IsReceived)
                                              VALUES(NEWID(),@gameid,@from_member_id,(select id from users where email = @to_member_id), @amount, GetUtcDate(),0,0)

                                Update Users 
                                Set PointUser = PointUser - @amount
                                where id = @from_member_id
                                
                                Select 1 as Output
                         end
                         else
                             begin
                               select 0 as Output
                             end

END
GO

if exists(select * from sys.objects where type = 'TF' and name ='SplitString')
begin
 drop function SplitString
end
go
CREATE FUNCTION SplitString
(    
      @Input NVARCHAR(MAX),
      @Character CHAR(1)
)
RETURNS @Output TABLE (
      Item NVARCHAR(1000)
)
AS
BEGIN
      DECLARE @StartIndex INT, @EndIndex INT
 
      SET @StartIndex = 1
      IF SUBSTRING(@Input, LEN(@Input) - 1, LEN(@Input)) <> @Character
      BEGIN
            SET @Input = @Input + @Character
      END
 
      WHILE CHARINDEX(@Character, @Input) > 0
      BEGIN
            SET @EndIndex = CHARINDEX(@Character, @Input)
           
            INSERT INTO @Output(Item)
            SELECT SUBSTRING(@Input, @StartIndex, @EndIndex - 1)
           
            SET @Input = SUBSTRING(@Input, @EndIndex + 1, LEN(@Input))
      END
 
      RETURN
END
GO






if exists(select * from sys.objects where type = 'p' and name ='DeleteTransferables')
begin
drop procedure DeleteTransferables
end

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE DeleteTransferables
	-- Add the parameters for the stored procedure here
	  @from_member_id nvarchar(36),
	  @gameid nvarchar(36),
	  @ids nvarchar(max)
	
AS
BEGIN

	SET NOCOUNT ON;
	declare @amount int
    select @amount = sum(amount) 
	from Transferable
	where id in(SELECT Item	FROM dbo.SplitString( @ids, ',') )
	and from_member_id =@from_member_id and gameId = @gameid
	group by from_member_id

	Update users
	set PointUser = PointUser+ isnull(@amount,0)
	where id = @from_member_id

	
	delete Transferable
	where id in (SELECT Item	FROM dbo.SplitString( @ids, ',') )
	
END
GO